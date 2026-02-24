import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

// Register custom Date transformer for Safari compatibility
// Safari throws "The string did not match the expected pattern" for some date formats
superjson.registerCustom<Date, string>(
  {
    isApplicable: (v): v is Date => v instanceof Date,
    serialize: (v) => v.toISOString(),
    deserialize: (v) => {
      const date = new Date(v);
      if (isNaN(date.getTime())) {
        const fallback = new Date(v.replace(' ', 'T') + (v.includes('Z') ? '' : 'Z'));
        return isNaN(fallback.getTime()) ? new Date(0) : fallback;
      }
      return date;
    },
  },
  'Date'
);

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
