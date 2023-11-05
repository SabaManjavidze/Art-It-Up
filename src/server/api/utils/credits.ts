import { prisma } from "../../db";

export const decreaseCredits = async (userId: string, amount: number) => {
  await prisma.$executeRaw`update User set credits = credits - ${amount} where id = \'${userId}\'`;
};
export const increaseCredits = async (userId: string, amount: number) => {
  await prisma.$executeRaw`update User set credits = credits + ${amount} where id = ${userId}`;
};
