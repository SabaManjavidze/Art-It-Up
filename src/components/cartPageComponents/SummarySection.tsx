import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import { SlPresent } from "react-icons/sl";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { BLANK_PROFILE_URL } from "@/utils/general/constants";
import { IoClose, IoCloseCircle, IoReload } from "react-icons/io5";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/utils/api";
import { personalDetailsSchema } from "@/utils/types/zodTypes";
import { toast } from "react-toastify";
import { ZodError } from "zod";
import { AiOutlineReload } from "react-icons/ai";

export default function SummarySection() {
  const {
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
    <section className="flex flex-col justify-between rounded-lg border px-4 py-10 shadow-lg md:px-7 lg:px-8 lg:py-10">
      <div>
        <p className="text-3xl leading-9 text-gray-800 lg:text-4xl">Summary</p>
        <div className="flex items-center justify-between pt-16">
          <p className="text-base leading-none text-gray-800 ">Subtotal</p>
          <p className="text-base leading-none text-gray-800 ">
            ${totalPrice / 100}
          </p>
        </div>
        <div className="flex items-center justify-between pt-5">
          <p className="flex-1 text-base leading-none text-gray-800">
            Shipping
          </p>
          {valuesChanged ? (
            <Button onClick={handleUpdateShippingCost}>
              <IoReload />
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
        <div className="mt-5 h-[1px] w-full bg-muted-foreground/50"></div>
        <div className="flex items-center justify-between pt-20 lg:pt-5">
          <p className="text-2xl font-bold leading-normal text-gray-800 ">
            Total
          </p>
          <p className="text-right text-2xl font-bold leading-normal text-gray-800 ">
            {shippingLoading ? (
              <Loader2 className="text-primary-foreground" />
            ) : (
              `\$${((shippingCost?.standard || 0) + totalPrice) / 100}`
            )}
          </p>
        </div>

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
            <Button
              className="flex w-full justify-center rounded-xl"
              onClick={handleShowButtonsClick}
            >
              {detailsLoading ? (
                <Loader2 size={20} className="text-secondary-foreground" />
              ) : (
                "Pay Now!"
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
