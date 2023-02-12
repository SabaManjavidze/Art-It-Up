import { createTRPCRouter } from "./trpc";
import { servicesRouter } from "./routers/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: servicesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
