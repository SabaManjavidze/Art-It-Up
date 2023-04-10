import { z } from "zod";
import { personalDetailsSchema } from "../../../utils/printify/printifyTypes";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { User } from "@prisma/client";

export const userRouter = createTRPCRouter({
  searchUsers: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input: { name }, ctx: { session } }) => {
      const userId = session.user.id;
      const userFriends = await prisma.friends.findMany({
        where: { OR: [{ user_id: userId }, { friend_id: userId }] },
      });
      const xprisma = prisma.$extends({
        result: {
          user: {
            isFriend: {
              needs: { id: true },
              compute(user) {
                let isFriend = false;
                for (let i = 0; i < userFriends.length; i++) {
                  const userFriend = userFriends[i];
                  if (
                    user.id == userFriend?.user_id ||
                    user.id == userFriend?.friend_id
                  ) {
                    isFriend = true;
                  }
                }
                return isFriend;
              },
            },
          },
        },
      });
      const users = await xprisma.user.findMany({
        where: {
          name: { contains: name },
        },
        select: { id: true, name: true, image: true, isFriend: true },
      });
      return users;
    }),
  me: protectedProcedure.query(async ({ ctx: { session } }) => {
    return (await prisma.user.findFirst({
      where: { id: session.user.id },
    })) as User;
  }),
  addPersonalDetails: protectedProcedure
    .input(personalDetailsSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      await prisma.userAddress.create({
        data: {
          ...input.address,
          zip: parseInt(input.address.zip),
          userId: session.user.id,
        },
      });
      await prisma.user.update({
        data: { phone: parseInt(input.phone) },
        where: { id: session.user.id },
      });
    }),
  updatePersonalDetails: protectedProcedure
    .input(personalDetailsSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ input, ctx: { session } }) => {
      await prisma.userAddress.update({
        where: { id: input.id },
        data: {
          ...input.address,
          zip: parseInt(input.address.zip),
          userId: session.user.id,
        },
      });
      await prisma.user.update({
        data: { phone: parseInt(input.phone) },
        where: { id: session.user.id },
      });
    }),

  deletePersonalDetails: protectedProcedure
    .input(z.object({ addressId: z.string() }))
    .mutation(async ({ ctx: { session }, input: { addressId } }) => {
      await prisma.userAddress.delete({
        where: { id: addressId },
      });
    }),
  getUserDetails: protectedProcedure.query(async ({ ctx: { session } }) => {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: session.user.id },
    });
    return addresses;
  }),
});
