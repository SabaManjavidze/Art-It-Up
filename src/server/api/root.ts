import { createTRPCRouter } from "./trpc";
import { servicesRouter } from "./routers/servicesRouter";
import { printifyRouter } from "./routers/printifyRouter";
import { userRouter } from "./routers/userRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  services: servicesRouter,
  printify: printifyRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
