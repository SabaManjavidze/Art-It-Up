import { createTRPCRouter, publicProcedure } from "./trpc";
import { servicesRouter } from "./routers/services.router";
import { printifyRouter } from "./routers/printify.router";
import { userRouter } from "./routers/user.router";
import { orderRouter } from "./routers/order.router";
import { entityRouter } from "./routers/entity.router";
import { cartRouter } from "./routers/cart.router";
import { friendsRouter } from "./routers/friends.router";
import { prisma } from "../db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  services: servicesRouter,
  printify: printifyRouter,
  user: userRouter,
  entity: entityRouter,
  order: orderRouter,
  cart: cartRouter,
  friends: friendsRouter,
  getTags: publicProcedure.query(async () => {
    return await prisma.tags.findMany();
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
