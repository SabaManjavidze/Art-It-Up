import { createTRPCRouter } from "./trpc";
import { servicesRouter } from "./routers/services.router";
import { printifyRouter } from "./routers/printify.router";
import { userRouter } from "./routers/user.router";
import { cartRouter } from "./routers/cart.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  services: servicesRouter,
  printify: printifyRouter,
  user: userRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
