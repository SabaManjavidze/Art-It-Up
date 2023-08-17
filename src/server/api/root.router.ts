import { createTRPCRouter, publicProcedure } from "./trpc";
import { servicesRouter } from "./routers/services.router";
import { productRouter } from "./routers/product.router";
import { userRouter } from "./routers/user.router";
import { orderRouter } from "./routers/order.router";
import { entityRouter } from "./routers/entity.router";
import { cartRouter } from "./routers/cart.router";
import { friendsRouter } from "./routers/friends.router";
import { prisma } from "../db";
import { addressRouter } from "./routers/address.router";
import { wishListRouter } from "./routers/wishList.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  services: servicesRouter,
  product: productRouter,
  user: userRouter,
  entity: entityRouter,
  address: addressRouter,
  order: orderRouter,
  cart: cartRouter,
  wishList: wishListRouter,
  friends: friendsRouter,
  getTags: publicProcedure.query(async () => {
    return await prisma.tags.findMany();
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
