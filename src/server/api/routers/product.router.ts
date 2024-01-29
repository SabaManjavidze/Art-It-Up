import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type {
  PrintifyGetProductResponse,
  Variant,
} from "../../../utils/printify/printifyTypes";

import { prisma } from "../../db";
import { TRPCError } from "@trpc/server";
import { printify } from "../../PrintifyClient";

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
        description: product.description,
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
  getPrintifyShopProducts: publicProcedure.query(async () => {
    const products = await printify.getProducts();
    return products;
  }),
});

function ProductIsClothe(product: PrintifyGetProductResponse) {
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
