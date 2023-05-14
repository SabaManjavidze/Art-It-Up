import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import { SlPresent } from "react-icons/sl";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { BLANK_PROFILE_URL } from "../../pages/_app";

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
  } = useCheckout();
  const [showButtons, setShowButtons] = useState(false);
  const handleShowButtonsClick = () => {
    if (checkIfReady()) setShowButtons(true);
  };
  return (
    <section className="flex flex-col justify-between px-4 py-6 md:px-7 md:py-10 lg:px-8 lg:py-20">
      <div>
        <p className="text-3xl font-black leading-9 text-gray-800 dark:text-white lg:text-4xl">
          Summary
        </p>
        <div className="flex items-center justify-between pt-16">
          <p className="text-base leading-none text-gray-800 dark:text-white">
            Subtotal
          </p>
          <p className="text-base leading-none text-gray-800 dark:text-white">
            ${totalPrice / 100}
          </p>
        </div>
        <div className="flex items-center justify-between pt-5">
          <p className="text-base leading-none text-gray-800 dark:text-white">
            Shipping
          </p>
          <p className="text-base leading-none text-gray-800 dark:text-white">
            ${(shippingCost?.standard as number) / 100}
          </p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between pb-6 pt-20 lg:pt-5">
          <p className="text-2xl leading-normal text-gray-800 dark:text-white">
            Total
          </p>
          <p className="text-right text-2xl font-bold leading-normal text-gray-800 dark:text-white">
            ${((shippingCost?.standard as number) + totalPrice) / 100}
          </p>
        </div>
        {friendEntity && (
          <button
            className="flex w-4/5 items-center justify-around rounded-md border-2 
                border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40
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
            <h3 className="text-lg text-skin-base">{friendEntity.name}</h3>
          </button>
        )}
        <button
          className="flex w-full items-center justify-center bg-red-900/50 py-5
              text-base leading-none text-white duration-150 ease-in-out focus:outline-none focus:ring-2 
              focus:ring-offset-2 dark:hover:bg-red-800/70"
          onClick={() => setShowPresentModal(true)}
        >
          <SlPresent size={20} className="mr-4 text-red-500" />
          Buy for a friend!
        </button>
        <div className="mt-3 ">
          {showButtons ? (
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
                className="flex w-full justify-center"
                onApprove={handleOnApprove}
                createOrder={handleCreateOrder}
              />
            </PayPalScriptProvider>
          ) : (
            <button
              className="w-full border border-gray-800 bg-gray-900 py-5
              text-base leading-none text-white duration-150 ease-in-out focus:outline-none focus:ring-2 
              focus:ring-gray-800 focus:ring-offset-2 dark:hover:bg-gray-700"
              onClick={handleShowButtonsClick}
            >
              Pay Now!
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
