import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type {
  Image2,
  PrintifyGetProductResponse,
  Variant,
} from "../../../utils/printify/printifyTypes";

import { prisma } from "../../db";
import { TRPCError } from "@trpc/server";
import { printify } from "../../PrintifyClient";
import PrintifyClient from "@kastlabs/printify-client";
import { printAreaSchema, variantSchema } from "@/utils/printify/printifyZod";
import type { v2 } from "cloudinary";

export const productRouter = createTRPCRouter({
  searchProducts: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        tags: z.array(z.string()).nullish(),

        limit: z.number().min(1).max(20).optional().default(20),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(
      async ({
        input: { name, tags, skip, limit, cursor },
        ctx: { session },
      }) => {
        const products = await prisma.product.findMany({
          take: limit + 1,
          skip,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            wishHolder: {
              where: {
                userId: session.user.id,
              },
            },
          },
          where: {
            title: { contains: name },
            tags:
              tags && tags.length > 0
                ? { some: { tag: { name: { in: tags } } } }
                : undefined,
          },
        });
        const items = products.map((product) => {
          const isInWishList = product.wishHolder.length > 0;
          const { wishHolder, ...newProduct } = product;
          return {
            ...newProduct,
            isInWishList,
          };
        });
        let nextCursor: typeof cursor | undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem?.id;
        }
        return { products: items, nextCursor };
      }
    ),

  getPrintifyProduct: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input: { id }, ctx: { session } }) => {
      const product = (await printify.getProduct(
        id
      )) as unknown as PrintifyGetProductResponse;
      const isClothe = ProductIsClothe(product);
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });
      let isInCart = false;
      let isInWishList = false;
      let style: undefined | { id: string; url: string };
      if (session?.user) {
        const record = await prisma.userCartProducts.findFirst({
          where: { AND: [{ userId: session.user.id }, { productId: id }] },
          include: {
            style: { select: { id: true, url: true } },
          },
        });
        if (record?.style) {
          style = record.style;
        }
        const record2 = await prisma.userWishListProducts.findFirst({
          where: { AND: [{ userId: session.user.id }, { productId: id }] },
        });
        isInCart = !!record;
        isInWishList = !!record2;
      }
      const sizes = extractSizesFromProduct(product);
      return {
        id: product.id,
        images: product.images,
        title: product.title,
        blueprint_id: product.blueprint_id,
        description: product.description,
        variants: product.variants,
        print_provider_id: product.print_provider_id,
        imgProps: product.print_areas[0]?.placeholders.find(
          (i) => i.position == "front"
        )?.images[0] as Image2,
        sizes,
        isClothe,
        isInCart,
        style,
        isInWishList,
      };
    }),
  setProductStyle: publicProcedure
    .input(z.object({ styleId: z.string(), productId: z.string() }))
    .mutation(async ({ input: { styleId, productId } }) => {
      await prisma.product.update({
        where: { id: productId },
        data: { styleId },
      });
    }),
  getPrintifyProductSizes: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id } }) => {
      const product = (await printify.getProduct(
        id
      )) as unknown as PrintifyGetProductResponse;
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });
      return extractSizesFromProduct(product);
    }),
  productMockupPreview: publicProcedure
    .input(
      z.object({
        title: z.string(),
        blueprint_id: z.number(),
        print_provider_id: z.number(),
        variants: variantSchema.array(),
        print_areas: printAreaSchema.array().nonempty(),
      })
    )
    .mutation(
      async ({
        input: {
          title,
          blueprint_id,
          print_provider_id,
          variants,
          print_areas,
        },
        ctx: { session },
      }) => {
        const print_areas2 = [];
        for (let j = 0; j < print_areas[0].placeholders.length; j++) {
          const placeholder = print_areas[0].placeholders[j];
          if (!placeholder) throw new Error("hello");
          const imgs = [];
          for (let i = 0; i < placeholder.images.length; i++) {
            const image = placeholder.images[i];
            if (!image) throw new Error("hello");
            const img = await printify.uploadImage({
              url: image?.src as string,
              file_name: image?.src as string,
            });
            imgs.push({
              id: img.id,
              ...image,
            });
          }
          print_areas2.push({
            images: imgs,
            position: placeholder.position,
          });
        }
        // create new product
        const product = await printify.createProduct({
          title,
          blueprint_id,
          print_provider_id,
          variants,
          print_areas: [
            {
              placeholders: print_areas2,
              variant_ids: print_areas[0].variant_ids,
            },
          ],
        });
        // upload new product images to the db to use it after deleting the product
        const newImgs: string[] = [];
        for (let i = 0; i < product.images.length; i++) {
          const result: UploadApiResponse = await v2.uploader.upload(
            product.images[i]?.src as string,
            {
              filename_override: session?.user.name as string,
              image_metadata: true,
            }
          );
          newImgs.push(result.url);
        }
        // delete the product
        await printify.deleteProduct({ id: product.id });
        return newImgs[0];
      }
    ),
  getPrintifyShopProducts: publicProcedure.query(async () => {
    const products = await printify.getProducts();
    return products;
  }),
});

export function ProductIsClothe(product: PrintifyGetProductResponse) {
  const HomeNLivingTag = "Home & Living";
  return product.tags.find((item) => item == HomeNLivingTag) === undefined;
}
function extractSizesFromProduct(product: PrintifyGetProductResponse) {
  const sizes = product.options.find((item) => item.type == "size")?.values;
  if (!sizes) return [];
  const defVar = product.variants[0] as Variant;
  let factor = 0;
  if (defVar.options.length > 1) {
    const isClothingType = ProductIsClothe(product);
    if (isClothingType) {
      factor = product.options.find((item) => item.type == "color")?.values[0]
        ?.id as number;
    } else {
      factor = product.options.find((item) => item.type == "depth")?.values[0]
        ?.id as number;
    }
  }
  return sizes.map((item) => {
    let variant = {} as Variant;
    if (factor) {
      variant = product.variants.find((item2) => {
        return (
          item2.options.includes(factor) && item2.options.includes(item.id)
        );
      }) as Variant;
    } else {
      variant = product.variants.find((item2) => {
        return item2.options.includes(item.id);
      }) as Variant;
    }
    return {
      id: item.id,
      title: item.title,
      variantId: variant.id,
      cost: variant.cost,
    };
  });
}
