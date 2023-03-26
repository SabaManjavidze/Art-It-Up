import { z, ZodArray } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import Paypal from "@paypal/checkout-server-sdk";

export const paypalRouter = createTRPCRouter({
  createPaypalOrder: protectedProcedure
    .input(z.object({ total: z.string(), product_id: z.string() }))
    .query(async ({ input: { total, product_id }, ctx: { session } }) => {
      const paypal = new Paypal.orders.OrdersCreateRequest();
      paypal.requestBody({
        intent: "AUTHORIZE",
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
        purchase_units: [
          {
            custom_id: product_id,
            amount: {
              currency_code: "usd",
              value: total,
            },
          },
        ],
      });
    }),
});
