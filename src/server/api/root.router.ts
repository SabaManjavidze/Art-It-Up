import {
  createContext,
  createContextInner,
  createTRPCRouter,
  publicProcedure,
} from "./trpc";
import { productRouter } from "./routers/product.router";
import { userRouter } from "./routers/user.router";
import { orderRouter } from "./routers/order.router";
import { galleryRouter } from "./routers/gallery.router";
import { cartRouter } from "./routers/cart.router";
import { friendsRouter } from "./routers/friends.router";
import { creditRouter } from "./routers/credit.router";
import { prisma } from "../db";
import { addressRouter } from "./routers/address.router";
import { wishListRouter } from "./routers/wishList.router";
import { stableDiffusionRouter } from "./routers/stableDiffusion.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  stableDiffusion: stableDiffusionRouter,
  user: userRouter,
  gallery: galleryRouter,
  address: addressRouter,
  order: orderRouter,
  cart: cartRouter,
  wishList: wishListRouter,
  friends: friendsRouter,
  credits: creditRouter,
  getTags: publicProcedure.query(async () => {
    return await prisma.tags.findMany();
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
