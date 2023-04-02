import { z } from "zod";
import { personalDetailsSchema } from "../../../utils/printify/printifyTypes";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const cartRouter = createTRPCRouter({
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
        variantId: z.number(),
        quantity: z.number(),
        size: z.string(),
        price: z.number(),
      })
    )
    .mutation(
      async ({
        input: {
          productId,
          picture,
          title,
          description,
          quantity,
          size,
          variantId,
          price,
        },
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
                },
              },
            },
            variantId,
            quantity,
            price,
            user: { connect: { id: session.user.id } },
            size,
          },
        });
      }
    ),
});
