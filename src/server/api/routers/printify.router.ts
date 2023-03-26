import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { createOrderItemSchema } from "../../../utils/printify/printifyTypes";
import PrintifyClient from "@kastlabs/printify-client";
import { prisma } from "../../db";
import { User } from "@prisma/client";

export const PRINTIFY_SHOP_ID = "5702174";
export const printify = new PrintifyClient({
  apiKey: process.env.PRINTIFY_ACCESS_TOKEN as string,
  shopId: PRINTIFY_SHOP_ID,
});

export const printifyRouter = createTRPCRouter({
  createPrintifyOrder: protectedProcedure
    .input(createOrderItemSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      const user = await prisma.user.findFirst({
        where: { id: session.user.id },
        include: { address: true },
      });

      if (!user?.address)
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
          phone: (user.phone + "") as string,
          first_name: user?.firstName as string,
          last_name: user?.lastName as string,
          address1: user.address.address1,
          address2: user.address.address2 + "",
          zip: user.address.zip + "",
          city: user.address.city,
          region: user.address.region,
          country: user.address.country,
        },
        line_items: input.line_items,
        send_shipping_notification: false,
        shipping_method: 1,
      });
      return { errors: null, success: true };
    }),
  getPrintifyProduct: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input: { id } }) => {
      const product = await printify.getProduct(id);
      if (product) return product;
    }),
  getPrintifyShopProducts: publicProcedure.query(async () => {
    const products = await printify.getProducts();
    return products;
  }),
});
