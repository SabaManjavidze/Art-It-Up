import { prisma } from "../src/server/db";
import {
  PrintifyGetProductResponse,
  Variant,
} from "../src/utils/printify/printifyTypes";
import lodash from "lodash";
import crypto from "crypto";
import { printify } from "../src/server/PrintifyClient";
import { Product } from "@prisma/client";

const seedProducts = async () => {
  const printifyProducts = (await printify.getProducts()) as unknown as {
    data: PrintifyGetProductResponse[];
  };
  const tags: { [key: string]: string } = {};
  const productTags: { productId: string; tagId: string }[] = [];

  const printifyProdIds = printifyProducts.data.map((product) => product.id);
  const foundProducts = await prisma.product.findMany({
    where: { id: { in: printifyProdIds } },
  });
  const foundProdIds = foundProducts.map((product) => product.id);
  const diff = lodash.difference(printifyProdIds, foundProdIds);

  let prodsToAdd: PrintifyGetProductResponse[];
  if (!diff) {
    prodsToAdd = printifyProducts.data;
  } else {
    prodsToAdd = printifyProducts.data.filter((item) => {
      const exists = diff.find((id) => id == item.id);
      return !!exists;
    });
  }

  const formatedProducts: Product[] = prodsToAdd.map((product) => {
    product.tags.forEach((tag) => {
      const id = crypto.randomUUID();
      if (!tags[tag]) {
        tags[tag] = id;
      }
      productTags.push({ tagId: tags[tag] as string, productId: product.id });
    });
    let variants: Variant[] = [];

    const HomeNLivingTag = "Home & Living";
    const BlanketTag = "Blankets";
    const PaperTag = "Paper";
    let defColor = 0;
    let defDepth = 0;
    const isClothingType =
      product.tags.find((item) => item == HomeNLivingTag) === undefined;
    const defVariant = product.variants?.[0];

    let variant = defVariant;

    if (product && (defVariant?.options?.length as number) > 1) {
      if (isClothingType) {
        defColor = product?.options?.find((item) => item?.type == "color")
          ?.values[0]?.id as number;
        variants = product.variants.filter(
          (variant) =>
            variant.options.find((option) => option == defColor) &&
            variant.is_available
        );
      } else if (product.tags.find((item) => item == BlanketTag || PaperTag)) {
        variants = product.variants;
      } else {
        defDepth = product?.options?.find((item) => item?.type == "depth")
          ?.values[0]?.id as number;
        variants = product.variants.filter(
          (variant) =>
            variant.options.find((option) => option == defDepth) &&
            variant.is_available
        );
      }

      variant = variants[0];
    }
    const sizes = product.options.find((item) => item.type == "size")?.values;

    const defSize = sizes?.[0];

    if (!variant) {
      console.log("couldn't find the varaint");
      console.log({
        varaints: variants.map((item) => item.options),
        defaultVariants: product.variants.map((item) => item.options),
        defSize: defSize?.id as number,
        defColor: defColor as number,
        defDepth: defDepth as number,
        title: product.title,
        tags: product.tags,
        options: product.options,
        isClothingType,
      });
      throw new Error("haha");
    }
    return {
      id: product.id,
      title: product.title,
      defaultPrice: variant.price,
      defautlSize: `${defSize?.id}:${defSize?.title}`,
      defaultVariantId: variant.id,
      description: product.description,
      picture: product.images[0]?.src.toString() as string,
      styleId: "",
      created_at: new Date(product.created_at),
    };
  });

  const tagKeys = Object.entries(tags);
  await prisma.product.createMany({ data: formatedProducts });
  await prisma.tags.createMany({
    data: tagKeys.map(([name, id]) => {
      return { name, id };
    }),
    skipDuplicates: true,
  });
  await prisma.productTags.createMany({
    data: productTags,
  });
};

seedProducts();
