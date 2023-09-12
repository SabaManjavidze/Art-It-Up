import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { MAX_WISHLIST_PRODUCT } from "@/utils/constants";

export const wishListRouter = createTRPCRouter({
  getWishList: protectedProcedure.query(async ({ ctx: { session } }) => {
    const products = await prisma.userWishListProducts.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
      },
    });
    return products;
  }),
  moveProductToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        styleId: z.string(),
      })
    )
    .mutation(async ({ input: { styleId, productId }, ctx: { session } }) => {
      const wishListRec = await prisma.userWishListProducts.findFirst({
        where: {
          AND: [{ userId: session.user.id }, { productId }],
        },
      });
      if (!wishListRec)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "something went wrong",
        });
      await prisma.userWishListProducts.delete({
        where: { userId_productId: { productId, userId: session.user.id } },
      });
      await prisma.userCartProducts.create({
        data: {
          userId: session.user.id,
          productId: productId,
          variantId: wishListRec.variantId,
          price: wishListRec.price,
          quantity: 1,
          styleId,
          size: wishListRec.size,
        },
      });
    }),
  removeProductFromList: protectedProcedure
    .input(
      z.object({
        productId: z.string().min(1),
      })
    )
    .mutation(async ({ input: { productId }, ctx: { session } }) => {
      await prisma.userWishListProducts.delete({
        where: { userId_productId: { productId, userId: session.user.id } },
      });
    }),
  addProductToList: protectedProcedure
    .input(
      z.object({
        productId: z.string().min(1),
        title: z.string(),
        picture: z.string(),
        description: z.string(),
        variantId: z.number(),
        sizeId: z.number(),
        sizeTitle: z.string(),
        price: z.number(),
        isInWishList: z.boolean(),
      })
    )
    .mutation(
      async ({
        input: {
          productId,
          picture,
          title,
          description,
          price,
          isInWishList,
          sizeId,
          sizeTitle,
          variantId,
        },
        ctx: { session },
      }) => {
        try {
          if (isInWishList) {
            await prisma.userWishListProducts.delete({
              where: {
                userId_productId: {
                  userId: session.user.id,
                  productId: productId,
                },
              },
            });
          } else {
            const { length } = await prisma.userWishListProducts.findMany({
              select: { productId: true },
            });
            if (length > MAX_WISHLIST_PRODUCT) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message: `Cannot add more than ${MAX_WISHLIST_PRODUCT} products in your WishList`,
              });
            }
            await prisma.userWishListProducts.create({
              data: {
                product: {
                  connect: {
                    id: productId,
                  },
                },
                variantId,
                price,
                user: { connect: { id: session.user.id } },
                size: `${sizeId}:${sizeTitle}`,
              },
            });
          }
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
              throw new TRPCError({
                code: "CONFLICT",
                message: "This product is already added to your wishlist",
              });
            }
          }
        }
      }
    ),
});
