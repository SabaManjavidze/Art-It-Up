import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import { SlPresent } from "react-icons/sl";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { BLANK_PROFILE_URL } from "../../pages/_app";
import { IoClose, IoCloseCircle } from "react-icons/io5";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/utils/api";
import { personalDetailsSchema } from "@/utils/zodTypes";
import { toast } from "react-toastify";
import { ZodError } from "zod";

export default function SummarySection({
  showPresentModal,
  setShowPresentModal,
}: {
  showPresentModal: boolean;
  setShowPresentModal: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    entity: friendEntity,
    handleOnApprove,
    handleCreateOrder,
    totalPrice,
    shippingCost,
    checkIfReady,
    shippingLoading,
    handleUpdateShippingCost,
    valuesChanged,
  } = useCheckout();
  const [showButtons, setShowButtons] = useState(false);
  const {
    data: personalDetails,
    isFetching: detailsLoading,
    refetch: fetchPersonalDetails,
  } = api.user.getPersonalDetails.useQuery(undefined, {
    enabled: false,
  });
  const handleShowButtonsClick = async () => {
    if (checkIfReady()) {
      const details = await fetchPersonalDetails();

      const result = await personalDetailsSchema.safeParseAsync(details);
      if (!result.success) {
        toast.error(result.error.issues[0]?.message);
        return;
      }
      setShowButtons(true);
    }
  };

  return (
    <section className="flex flex-col justify-between bg-primary/5 px-4 py-6 md:px-7 md:py-10 lg:px-8 lg:py-20">
      <div>
        <p className="text-3xl font-black leading-9 text-gray-800 lg:text-4xl">
          Summary
        </p>
        <div className="flex items-center justify-between pt-16">
          <p className="text-base leading-none text-gray-800 ">Subtotal</p>
          <p className="text-base leading-none text-gray-800 ">
            ${totalPrice / 100}
          </p>
        </div>
        <div className="flex items-center justify-between pt-5">
          <p className="flex-1 text-base leading-none text-gray-800 ">
            Shipping
          </p>
          {valuesChanged ? (
            <Button onClick={handleUpdateShippingCost}>
              Show Shipping Cost
            </Button>
          ) : (
            <p className="flex-1 text-end leading-none text-gray-800 ">
              $
              {shippingLoading
                ? "loading..."
                : shippingCost
                ? shippingCost.standard / 100
                : "You need to add a shipping address"}
            </p>
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between pb-6 pt-20 lg:pt-5">
          <p className="text-2xl leading-normal text-gray-800 ">Total</p>
          <p className="text-right text-2xl font-bold leading-normal text-gray-800 ">
            {shippingLoading ? (
              <Loader2 className="text-primary-foreground" />
            ) : (
              `\$${((shippingCost?.standard as number) + totalPrice) / 100}`
            )}
          </p>
        </div>
        {friendEntity && (
          <button
            className="my-4 flex w-4/5 items-center justify-around rounded-md 
                border-2 border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40
                disabled:border-gray-400 disabled:text-gray-400 disabled:hover:bg-transparent"
            disabled
          >
            <Image
              src={friendEntity.picture || BLANK_PROFILE_URL}
              width={50}
              height={50}
              className=" rounded-full"
              alt="user profile image"
            />
            <h3 className="text-skin-base text-lg">{friendEntity.name}</h3>
          </button>
        )}
        <button
          className="flex w-full items-center justify-center bg-red-500 py-5
              text-base leading-none text-secondary-foreground duration-150 ease-in-out hover:bg-red-600 focus:outline-none 
              focus:ring-2 focus:ring-offset-2"
          onClick={() => setShowPresentModal(true)}
        >
          <SlPresent size={20} className="mr-4 text-secondary-foreground" />
          Buy for a friend!
        </button>
        <div className="mt-3">
          {showButtons ? (
            <div>
              <div className="relative h-7">
                <IoCloseCircle
                  className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-muted-foreground/90"
                  size={20}
                  onClick={() => setShowButtons(false)}
                />
              </div>
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
                  className="flex justify-center"
                  onApprove={handleOnApprove}
                  createOrder={handleCreateOrder}
                />
              </PayPalScriptProvider>
            </div>
          ) : (
            <button
              className="flex w-full justify-center border border-gray-800 bg-gray-900 py-5
              text-base leading-none text-secondary-foreground duration-150 ease-in-out hover:bg-gray-700 focus:outline-none 
              focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
              onClick={handleShowButtonsClick}
            >
              {detailsLoading ? (
                <Loader2 size={20} className="text-secondary-foreground" />
              ) : (
                "Pay Now!"
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
