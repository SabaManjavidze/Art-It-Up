import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { PrintifyGetProductResponse } from "../../../utils/printify/printifyTypes";
import {
  addressToSchema,
  createOrderItemSchema,
  lineItemsZodType,
} from "../../../utils/printify/printifyTypes";
import { prisma } from "../../db";
import { Printify } from "../../PrintifyClient";

export const printify = new Printify({
  apiKey: process.env.PRINTIFY_ACCESS_TOKEN as string,
  shopId: process.env.PRINTIFY_SHOP_ID,
});

export const printifyRouter = createTRPCRouter({
  searchProducts: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        tags: z.array(z.string()).nullish(),
      })
    )
    .query(async ({ input: { name, tags }, ctx: { session } }) => {
      const products = await prisma.product.findMany({
        where: {
          title: { contains: name },
          tags:
            tags && tags.length > 0
              ? { some: { tag: { name: { in: tags } } } }
              : undefined,
        },
      });
      return products;
    }),
  createPrintifyOrder: protectedProcedure
    .input(createOrderItemSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      const user = await prisma.user.findFirst({
        where: { id: session.user.id },
        include: { address: true },
      });

      const address = user?.address[0];
      if (!address)
        return {
          success: false,
          errors: {
            message: "user has not added personal details",
            description:
              "You can add your personal details your the profile page",
          },
        };

      await printify.createOrder({
        address_to: {
          email: session.user.email as string,
          phone: user.phone?.toString() as string,
          first_name: user?.firstName as string,
          last_name: user?.lastName as string,
          address1: address.address1,
          address2: address.address2.toString(),
          zip: address.zip.toString(),
          city: address.city,
          region: address.region as "",
          country: address.country,
        },
        line_items: input.line_items as [(typeof input.line_items)[number]],
        send_shipping_notification: false,
        shipping_method: 1,
        external_id: "",
      });
      return { errors: null, success: true };
    }),
  calculateOrderShipping: protectedProcedure
    .input(
      z.object({
        address_to: addressToSchema.omit({ title: true }),
        line_items: lineItemsZodType,
      })
    )
    .mutation(
      async ({ input: { address_to, line_items }, ctx: { session } }) => {
        // const product = await
        const user = await prisma.user.findFirst({
          where: { id: session.user.id },
        });
        if (!user) throw new Error("no user");
        return await printify.calculateShipping(address_to, line_items, {
          email: user.email as string,
          first_name: user.firstName as string,
          last_name: user.lastName as string,
          phone: user.phone?.toString() as string,
        });
      }
    ),
  getPrintifyProduct: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input: { id } }) => {
      const product = await printify.getProduct(id);
      if (product) return product as unknown as PrintifyGetProductResponse;
    }),
  getPrintifyShopProducts: publicProcedure.query(async () => {
    const products = await printify.getProducts();
    return products;
  }),
});
