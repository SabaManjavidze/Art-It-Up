import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx: { session } }) => {
    const products = await prisma.userCartProducts.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
      },
    });
    return products;
  }),
  addProductToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string().min(1),
        title: z.string(),
        picture: z.string(),
        description: z.string(),
      })
    )
    .mutation(
      async ({
        input: { productId, picture, title, description },
        ctx: { session },
      }) => {
        await prisma.userCartProducts.create({
          data: {
            product: {
              connectOrCreate: {
                where: { id: productId },
                create: {
                  id: productId,
                  title,
                  picture,
                  description,
                  price: 0,
                  size: "hello",
                },
              },
            },
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
      }
    ),
});
