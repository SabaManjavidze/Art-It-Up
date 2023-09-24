import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  DefaultUser,
} from "next-auth";
import type { FacebookProfile } from "next-auth/providers/facebook";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import type { GoogleProfile } from "next-auth/providers/google";
import axios from "axios";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
  interface User extends DefaultUser {
    id: string;
    credits?: number
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.credits = user.credits;
      }
      return session;
    },
    redirect(params) {
      return params.baseUrl;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID?.toString() as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?.toString() as string,
      allowDangerousEmailAccountLinking: true,
      async profile(prof: GoogleProfile, tokens) {
        let birthday: undefined | Date
        try {
          const baseUrl = "https://people.googleapis.com/v1/people"
          const { data } = await axios.get(`${baseUrl}/${prof.sub}?personFields=birthdays&key=${process.env.GOOGLE_API_KEY as string}&access_token=${tokens.access_token}`)
          const bd = data.birthdays[0].date
          birthday = new Date(bd.year, bd.month - 1, bd.day)
        } catch (e) {
          console.log("erori xdebbaaaa", JSON.stringify(e))
        }
        return {
          firstName: prof.given_name,
          lastName: prof.family_name,
          email: prof.email,
          emailVerified: prof.email_verified,
          id: prof.sub,
          image: prof.picture,
          name: prof.name,
          birthday
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID?.toString() as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET?.toString() as string,
      allowDangerousEmailAccountLinking: true,
      authorization:
        "https://www.facebook.com/v11.0/dialog/oauth?scope=email,public_profile,user_birthday",
      userinfo: {
        url: "https://graph.facebook.com/me",
        params: { fields: "first_name,last_name,id,name,email,picture,birthday" },
      },
      profile(profile: FacebookProfile) {
        console.log({ profile })
        return {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          emailVerified: true,
          name: profile.name,
          image: profile.picture.data.url,
          birthday: new Date(profile.birthday)
        };
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
