import { ZodError, z } from "zod";
import { prisma } from "../../db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { printify } from "../../PrintifyClient";
import {
  addressToSchema,
  createOrderItemSchema,
  lineItemsZodType,
  personalDetailsSchema,
} from "@/utils/zodTypes";

export const orderRouter = createTRPCRouter({
  getMyOrders: protectedProcedure.query(async ({ ctx: { session } }) => {
    const orders = await prisma.order.findMany({
      where: { creatorId: session.user.id },
      include: { line_items: { include: { product: true } } },
    });
    return orders;
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
        const user = await prisma.user.findFirst({
          where: { id: session.user.id },
        });

        if (!user) throw new TRPCError({ code: "BAD_REQUEST" });

        return await printify.calculateShipping(address_to, line_items, {
          email: user.email as string,
          first_name: user.firstName as string,
          last_name: user.lastName as string,
          phone: user.phone?.toString() as string,
        });
      }
    ),
  createPrintifyOrder: protectedProcedure
    .input(createOrderItemSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      const user = await prisma.user.findFirst({
        where: { id: session.user.id },
        select: {
          address: { where: { id: input.addressId, selected: true } },
          firstName: true,
          lastName: true,
          phone: true,
        },
      });
      console.log("user found");

      if (!user) throw new TRPCError({ code: "BAD_REQUEST" });

      await personalDetailsSchema.parseAsync(user);

      const address = user?.address[0];
      if (!address)
        throw new TRPCError({
          code: "FORBIDDEN",
          cause: {
            message: "user has not added an address to ship to",
            description: "You can add shipping address from the profile page",
          },
        });
      const { id: orderId } = await prisma.order.create({
        data: {
          addressId: input.addressId,
          creatorId: session.user.id,
          entityId: input.entityId,
          totalPrice: input.totalPrice,
          totalShipping: input.totalShipping,
        },
      });
      const formatedLineItems = input.line_items.map((item) => {
        return {
          productId: item.product_id,
          variantId: item.variant_id,
          quantity: item.quantity,
        };
      });
      await prisma.lineItems.createMany({
        data: formatedLineItems.map((item) => {
          return {
            orderId,
            ...item,
            cost: 0,
            shippingCost: 0,
          };
        }),
      });
      const createOrderObj = {
        address_to: {
          email: session.user.email as string,
          phone: user?.phone?.toString() as string,
          first_name: user.firstName as string,
          last_name: user.lastName as string,
          address1: address.address1,
          address2: address?.address2?.toString() || "",
          zip: address.zip,
          city: address.city,
          region: address.region as "",
          country: address.country,
        },
        line_items: input.line_items as [(typeof input.line_items)[number]],
        send_shipping_notification: false,
        shipping_method: 1,
        external_id: input?.entityId ?? "",
      };
      await printify.createOrder(createOrderObj);
    }),
});
