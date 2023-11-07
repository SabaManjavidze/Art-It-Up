import { Button } from "@/components/ui/button";
import { prisma } from "@/server/db";
import { AuthProviders } from "@/utils/types/types";
import { GetServerSideProps } from "next";
import { SignInOptions, signIn } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
export default function ReferralPage({
  title,
  inviteId,
  username,
  profilePic,
}: {
  title: string | null;
  inviteId: string;
  username: string;
  profilePic: string;
}) {
  const [loading, setLoading] = useState<AuthProviders | "none">("none");
  const logIn = async (provider: AuthProviders) => {
    setLoading(provider);
    const url = `${process.env.NEXTAUTH_URL}/api/referral-auth?invite=${inviteId}`;
    const authOptions = {
      callbackUrl: url,
      redirect: true,
    };
    await signIn(provider, authOptions);
    setLoading("none");
  };
  console.log(profilePic);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={profilePic} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <div className="flex min-h-screen flex-col items-center">
        <div className="mt-64 flex text-4xl">
          <h1 className="mr-3 text-accent-foreground">{username}</h1>
          <h1>invites you to join our community!</h1>
        </div>
        <div className="mt-16 flex flex-col justify-center">
          <Button
            onClick={() => logIn("google")}
            isLoading={loading == "google"}
            className="flex h-20 w-80 cursor-pointer items-center justify-center rounded bg-blue-500 py-3 px-4 text-sm font-bold text-gray-100 shadow hover:bg-blue-600 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="mr-3 h-6 w-[10%] fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            <span className="mr-1 block h-6 w-1 border-l border-white"></span>
            <span className="w-[90%] pl-3 font-sans text-lg">
              Sign up with Google
            </span>
          </Button>

          <Button
            onClick={() => logIn("facebook")}
            isLoading={loading == "facebook"}
            className="mt-2 flex h-20 w-80 cursor-pointer items-center justify-center rounded bg-indigo-600 py-3 px-4 text-sm font-bold text-gray-100 shadow hover:bg-indigo-700 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="mr-3 h-6 w-[10%] fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z" />
            </svg>
            <span className="mr-1 block h-6 w-1 border-l border-white"></span>
            <span className="w-[90%] pl-3 font-sans text-lg">
              Sign up with Facebook
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let title = null;
  const inviteId = context?.params?.inviteId as string;
  if (!inviteId)
    return {
      redirect: "/",
      props: {},
    };
  const user = await prisma.user.findFirst({
    where: { id: inviteId },
    select: { name: true, image: true },
  });
  if (!user)
    return {
      props: {},
      redirect: "/",
    };
  title = `${user.name} invited you to join Art It Up`;
  return {
    props: {
      title,
      inviteId,
      username: user.name,
      profilePic: user.image,
    },
  };
};
