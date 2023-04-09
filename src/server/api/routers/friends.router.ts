import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const friendsRouter = createTRPCRouter({
  getRecievedRequests: protectedProcedure
  .query(async({input,ctx:{session}})=>{
	  const requests=await prisma.friends.findMany({where:{friend_id:session.user.id}})
	  return requests
  }),
  getFriends: protectedProcedure
    // .input(
    //   z.object({
    //     entityId: z.string(),
    //     friendId: z.string(),
    //   })
    // )
    .mutation(async({ctx:{session}})=>{
const friends = await prisma.user.findFirst({where:{id:session.user.id},include:{userFriends:true}})
console.log({friends})
	    return ""
    }),
  sendFriendRequest: protectedProcedure
    .input(
      z.object({
        addressantId: z.string(),
      })
    )
    .mutation(
      async ({ input: { addressantId}, ctx: { session } }) => {
        const addressant = await prisma.user.findFirst({
          where: { id: addressantId },
        });
        const friendShipRecord = await prisma.friends.findMany({
          where: {
            AND: { user_id: session.user.id, friend_id: addressantId },
            OR: { user_id: addressantId, friend_id: session.user.id },
          },
        });
        if (friendShipRecord.length <= 0) {
          throw new Error(
            `You have to be friends with ${addressant?.name}`
          );
        }
      }

    ),
});
