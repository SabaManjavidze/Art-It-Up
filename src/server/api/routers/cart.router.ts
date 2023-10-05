import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { MAX_CART_PRODUCT } from "@/utils/general/constants";

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx: { session } }) => {
    const products = await prisma.userCartProducts.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
      },
    });
    return products.map((item) => {
      const [sizeId, sizeTitle] = item.size.split(":");
      return {
        ...item,
        sizeId: parseInt(sizeId as string),
        sizeTitle: sizeTitle as string,
      };
    });
  }),
  removeProductFromCart: protectedProcedure
    .input(
      z.object({
        productId: z.string().min(1),
      })
    )
    .mutation(async ({ input: { productId }, ctx: { session } }) => {
      await prisma.userCartProducts.delete({
        where: { userId_productId: { productId, userId: session.user.id } },
      });
    }),
  addProductToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string().min(1),
        variantId: z.number(),
        styleId: z.string(),
        quantity: z.number(),
        sizeId: z.number(),
        sizeTitle: z.string(),
        price: z.number(),
        isInCart: z.boolean(),
      })
    )
    .mutation(
      async ({
        input: {
          productId,
          styleId,
          quantity,
          sizeId,
          sizeTitle,
          variantId,
          price,
          isInCart,
        },
        ctx: { session },
      }) => {
        try {
          if (isInCart) {
            await prisma.userCartProducts.delete({
              where: {
                userId_productId: {
                  userId: session.user.id,
                  productId: productId,
                },
              },
            });
          } else {
            const { length } = await prisma.userCartProducts.findMany({
              select: { productId: true },
            });
            if (length > MAX_CART_PRODUCT) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message: `Cannot add more than ${MAX_CART_PRODUCT} products in your Cart`,
              });
            }
            await prisma.userCartProducts.create({
              data: {
                product: { connect: { id: productId } },
                user: { connect: { id: session.user.id } },
                style: { connect: { id: styleId } },
                variantId,
                quantity,
                price,
                size: `${sizeId}:${sizeTitle}`,
              },
            });
          }
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
              throw new TRPCError({
                code: "CONFLICT",
                message: "This product is already added to your cart",
              });
            }
          }
        }
      }
    ),
});
