import { printify } from "../src/server/api/routers/printify.router";
import { prisma } from "../src/server/db";
import { PrintifyGetProductResponse } from "../src/utils/printify/printifyTypes";
import crypto from "crypto";

const seedProducts = async () => {
  const printifyProducts = (await printify.getProducts()) as unknown as {
    data: PrintifyGetProductResponse[];
  };
  const tags: { [key: string]: string } = {};
  const productTags: { productId: string; tagId: string }[] = [];

  const formatedProducts = printifyProducts.data.map((product) => {
    product.tags.forEach((tag) => {
      const id = crypto.randomUUID();
      if (!tags[tag]) {
        tags[tag] = id;
      }
      productTags.push({ tagId: id, productId: product.id });
    });
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      picture: product.images[0]?.src.toString() as string,
      created_at: new Date(product.created_at),
    };
  });

  const tagKeys = Object.entries(tags);
  await prisma.product.createMany({ data: formatedProducts });
  await prisma.tags.createMany({
    data: tagKeys.map(([name, id]) => {
      return { name, id };
    }),
  });
  await prisma.productTags.createMany({
    data: productTags,
  });
};

seedProducts();