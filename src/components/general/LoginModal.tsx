import React, { Dispatch, SetStateAction, useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { AuthProviders } from "@/utils/types/types";
import { signIn } from "next-auth/react";
export default function LoginModal({
  modalOpen,
  closeModal,
}: //   setShowModal,
{
  modalOpen: boolean;
  //   setShowModal: Dispatch<SetStateAction<boolean>>;
  closeModal: () => void;
}) {
  const [loading, setLoading] = useState<AuthProviders | "none">("none");
  const logIn = async (provider: AuthProviders) => {
    setLoading(provider);
    await signIn(provider);
    setLoading("none");
  };
  return (
    <Modal isOpen={modalOpen} title="Sign In" closeModal={closeModal}>
      <div className="flex flex-col items-center justify-center py-12">
        <Button
          onClick={() => logIn("google")}
          //   isLoading={loading == "google"}
          className="flex h-16 w-72 cursor-pointer items-center justify-center rounded bg-blue-500 py-3 px-4 text-sm font-bold text-gray-100 shadow hover:bg-blue-600 hover:text-white"
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
          className="mt-2 flex h-16  w-72 cursor-pointer items-center justify-center rounded bg-indigo-600 py-3 px-4 text-sm font-bold text-gray-100 shadow hover:bg-indigo-700 hover:text-white"
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
    </Modal>
  );
}
