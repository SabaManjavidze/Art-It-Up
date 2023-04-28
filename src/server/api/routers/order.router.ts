import { z } from "zod";
import { personalDetailsSchema } from "../../../utils/printify/printifyTypes";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { User } from "@prisma/client";

export const orderRouter = createTRPCRouter({
  getMyOrders: protectedProcedure.query(async ({ ctx: { session } }) => {
    const orders = await prisma.order.findMany({
      where: { creatorId: session.user.id },
    });
    return orders;
  }),
});
