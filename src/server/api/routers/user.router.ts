import { z } from "zod";
import { addressToSchema } from "@/utils/types/zodTypes";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { Prisma, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getPersonalDetails: protectedProcedure.query(async ({ ctx: { session } }) => {
    const details = await prisma.user.findFirst({
      where: { id: session.user.id },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        birthday: true,
        friendUserFriends: {
          where: { status: "ACCEPTED" },
          select: { friendId: true },
        },
        userFriends: {
          where: { status: "ACCEPTED" },
          select: { friendId: true },
        },
      },
    });
    if (!details)
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    return {
      ...details,
      birthday: details.birthday?.toLocaleDateString(),
      friendCount:
        details.friendUserFriends.length + details.userFriends.length,
    };
  }),
  addPersonalDetails: protectedProcedure
    .input(
      z.object({
        phone: z.number(),
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(
      async ({ input: { phone, firstName, lastName }, ctx: { session } }) => {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            firstName,
            lastName,
            phone,
          },
        });
      }
    ),
  searchFriends: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input: { name }, ctx: { session } }) => {
      const userId = session.user.id;
      const minimalUser = { name: true, image: true, id: true };
      const userFriends = await prisma.friends.findMany({
        include: {
          friend: { select: minimalUser },
          user: { select: minimalUser },
        },
        where: {
          AND: [{ OR: [{ userId: userId }, { friendId: userId }] }],
        },
      });
      const filteredFriends: { name: string; image: string; id: string }[] = [];
      userFriends.forEach((fRecord) => {
        const friendName = fRecord.friend.name as string;
        const userName = fRecord.user.name as string;
        if (
          friendName.toLowerCase().startsWith(name) &&
          fRecord.friendId !== userId
        ) {
          filteredFriends.push(fRecord.friend);
        }
        if (
          userName.toLowerCase().startsWith(name) &&
          fRecord.userId !== userId
        )
          filteredFriends.push(fRecord.user);
      });

      return filteredFriends;
    }),

  searchUsers: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input: { name }, ctx: { session } }) => {
      const userId = session.user.id;
      const userFriends = await prisma.friends.findMany({
        where: { OR: [{ userId: userId }, { friendId: userId }] },
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
                    user.id == userFriend?.userId ||
                    user.id == userFriend?.friendId
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
      select: {
        name: true,
        image: true,
        id: true,
      },
    })) as User;
  }),
  addShippingAddress: protectedProcedure
    .input(addressToSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      try {
        await prisma.userAddress.update({
          where: {
            selectedAddress: { userId: session.user.id, selected: true },
          },
          data: { selected: false },
        });
      } catch (e) {}
      await prisma.userAddress.create({
        data: {
          ...input,
          userId: session.user.id,
          selected: true,
        },
      });
    }),
  updatePersonalDetails: protectedProcedure
    .input(addressToSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ input, ctx: { session } }) => {
      await prisma.userAddress.update({
        where: { id: input.id },
        data: {
          ...input,
          zip: input.zip,
          userId: session.user.id,
        },
      });
    }),

  deletePersonalDetails: protectedProcedure
    .input(z.object({ addressId: z.string() }))
    .mutation(async ({ ctx: { session }, input: { addressId } }) => {
      await prisma.userAddress.delete({
        where: { id: addressId },
      });
    }),
  getUserAddress: protectedProcedure.query(async ({ ctx: { session } }) => {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: session.user.id },
    });
    return addresses;
  }),
});
