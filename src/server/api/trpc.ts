/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * tl;dr - This is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the
 * database, the session, etc.
 */
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Session } from "next-auth";

import { getServerAuthSession } from "../auth";
import { prisma } from "../db";

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
}

export async function createContextInner(opts?: CreateInnerContextOptions) {
  return {
    prisma,
    session: opts?.session,
  };
}

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  const innerContext = await createContextInner({
    session,
  });
  return {
    ...innerContext,
    req: opts.req,
    res: opts.res,
  };
};

import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

export type Context = inferAsyncReturnType<typeof createContextInner>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
