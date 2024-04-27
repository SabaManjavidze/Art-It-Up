import React, { Dispatch, SetStateAction, useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AuthProviders } from "@/utils/types/types";
import { signIn } from "next-auth/react";
import { FaListCheck } from "react-icons/fa6";
import { useModal } from "@/hooks/useLoginModal";
import { IoCloseCircle } from "react-icons/io5";
import type { PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { BsChevronLeft } from "react-icons/bs";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
export default function WhitelistModal({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) {
  const { setLoginModal: setLoginModal } = useModal();
  const [page, setPage] = useState<"main" | "payment">("main");
  const { mutateAsync: whitelist, isLoading } = api.whitelist.useMutation();

  const createOrder: PayPalButtonsComponentProps["createOrder"] = async (
    data,
    actions
  ) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "15",
          },
          description: "Whitelist sign up fee.",
        },
      ],
    });
  };
  const handleOnApprove: PayPalButtonsComponentProps["onApprove"] = async (
    data,
    actions
  ) => {
    await whitelist();
    closeModal();
    return actions?.order?.capture().then((details) => {
      const name = details?.payer?.name?.given_name;
      toast.success(`Transaction completed by ${name} (PayPal username)`);
    });
  };
  return (
    <Modal
      isOpen={modalOpen}
      className="max-h-[80%] overflow-auto"
      title={
        page == "main" ? (
          <div>
            <p className="inline font-medium uppercase text-accent-foreground">
              ai image generation{" "}
            </p>
            <p className="inline">
              feature is coming soon. Meanwhile, you can sign up for our{" "}
            </p>
            <p className="inline text-accent-foreground">whitelist </p>
            <p className="inline">and get a one-time use code for </p>
            <p className="inline text-accent-foreground">discount </p>
            <p className="inline">image generation in the future</p>
          </div>
        ) : undefined
      }
      closeModal={closeModal}
    >
      {page == "main" ? (
        <div className="flex flex-col items-center justify-center pt-8">
          <Button
            onClick={() => setPage("payment")}
            className="flex h-16 w-72 cursor-pointer items-center justify-center rounded bg-blue-500 py-3 px-4 text-sm font-bold text-gray-100 shadow hover:bg-blue-600 hover:text-white"
          >
            <span className="flex items-center pl-3 font-sans text-lg">
              <FaListCheck className="mr-3" />
              Sign up for the Whitelist
            </span>
          </Button>

          <Button
            onClick={() => {
              setLoginModal(true);
              closeModal();
            }}
            variant={"link"}
            className="h-16 w-72 cursor-pointer items-center  justify-center rounded border-none py-3 text-sm font-bold"
          >
            <span className="whitespace-nowrap pl-3 font-sans text-xs text-accent-foreground underline">
              If you dont' have an account, Click Here!
            </span>
          </Button>
        </div>
      ) : page == "payment" ? (
        <div>
          <Button
            onClick={() => setPage("main")}
            variant={"ghost"}
            className="cursor absolute top-4 left-5 rounded-md  p-[2px] duration-150 focus:border-gray-700/50"
          >
            <BsChevronLeft size={15} />
          </Button>
          <PayPalScriptProvider
            options={{
              "client-id": process.env.PAYPAL_CLIENT_ID as string,
            }}
          >
            <PayPalButtons
              style={{
                label: "checkout",
                tagline: false,
                shape: "pill",
              }}
              className="mt-12 flex justify-center"
              onApprove={handleOnApprove}
              createOrder={createOrder}
            />
          </PayPalScriptProvider>
        </div>
      ) : null}
    </Modal>
  );
}
