import React, { useCallback, useState } from "react";
import { ClipLoader } from "react-spinners";
import CartProductCard from "../../components/CartProductCard";
import { SlPresent } from "react-icons/sl";
import { api } from "../../utils/api";
import Link from "next/link";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Modal from "../UI/Modal";
import Image from "next/image";
import { debounce } from "lodash";
import { BLANK_PROFILE_URL } from "../../pages/_app";

export default function CartPage() {
  const {
    products,
    shippingCost,
    handleOnApprove,
    handleOnClick,
    handleCreateOrder,
    setEntity,
    totalPrice,
    entity: friendEntity,
  } = useCheckout();
  const [showButtons, setShowButtons] = useState(false);
  const [showEntities, setShowEntities] = useState("");
  const [showPresentModal, setShowPresentModal] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const {
    data: users,
    mutateAsync: searchUsers,
    isLoading: usersLoading,
  } = api.user.searchFriends.useMutation();
  const {
    data: entities,
    mutateAsync: getEntities,
    isLoading: entitiesLoading,
  } = api.entity.getEntities.useMutation();
  const debouncedSearchUsers = useCallback(
    debounce((value) => {
      searchUsers({ name: value });
      console.log(value);
    }, 500),
    []
  );
  return (
    <div className="min-h-screen w-full bg-skin-main text-skin-base ">
      <Modal
        title="Buy for a friend"
        isOpen={showPresentModal}
        closeModal={() => setShowPresentModal(false)}
      >
        <input
          type="text"
          placeholder="Search..."
          className="mt-4 w-full rounded-none border-[1px] border-gray-400 bg-skin-light-secondary 
          py-2 pl-5 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userQuery}
          onChange={(e) => {
            const value = e.currentTarget.value;
            debouncedSearchUsers(value);
            setUserQuery(value);
          }}
        />
        {usersLoading ? (
          <div className="flex h-48 items-center justify-center">
            <ClipLoader size={20} color="white" />
          </div>
        ) : (
          users?.map((user) => (
            <div
              key={user.id}
              className="mt-5 flex w-full flex-col items-center justify-around text-white"
            >
              <button
                className="flex w-full items-center justify-around rounded-md border-2 border-white 
                p-2 duration-150  hover:bg-white/20 active:bg-white/40
                disabled:border-gray-400 disabled:text-gray-400 disabled:hover:bg-transparent"
                onClick={async () => {
                  if (showEntities.length < 1) {
                    setShowEntities(user.id);
                    if (entities?.length == 0 || !entities)
                      await getEntities({ userId: user.id });
                  } else {
                    setShowEntities("");
                  }
                }}
              >
                <Image
                  src={user?.image || BLANK_PROFILE_URL}
                  width={50}
                  height={50}
                  className="h-auto w-auto rounded-full"
                  alt="user profile image"
                />
                <h3 className="text-lg text-skin-base">{user.name}</h3>
              </button>
              <div className="mt-3 flex w-full justify-end">
                {showEntities === user.id &&
                  entities?.map((entity) => (
                    <button
                      className="flex w-4/5 items-center justify-around rounded-md border-2 
                border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40
                disabled:border-gray-400 disabled:text-gray-400 disabled:hover:bg-transparent"
                      key={entity.id}
                      onClick={() => {
                        const { creatorId, ...minEntity } = entity;
                        setEntity(minEntity);
                        setShowPresentModal(false);
                      }}
                    >
                      <Image
                        src={entity.picture || BLANK_PROFILE_URL}
                        width={50}
                        height={50}
                        className="h-auto w-auto rounded-full"
                        alt="user profile image"
                      />
                      <h3 className="text-lg text-skin-base">{entity.name}</h3>
                    </button>
                  ))}
              </div>
            </div>
          ))
        )}
      </Modal>
      <div className="flex flex-col justify-end lg:flex-row">
        <div
          className="w-full px-4 py-4 
        md:px-6 md:py-8 lg:px-8 lg:py-14"
        >
          <p className="pt-3 text-3xl font-black leading-10 dark:text-white lg:text-4xl">
            Cart
          </p>

          {products.map((cartProduct) => {
            return (
              <CartProductCard
                key={cartProduct.productId}
                title={cartProduct.product.title}
                src={cartProduct.product.picture}
                href={`/product/${cartProduct.productId}`}
                description={cartProduct.product.description}
                price={cartProduct.price / 100}
              />
            );
          })}
        </div>
        <div className="mt-32 mr-5 h-full w-full bg-gray-100 dark:bg-gray-800 md:w-full lg:w-96">
          <div className="flex flex-col justify-between px-4 py-6 md:px-7 md:py-10 lg:px-8 lg:py-20">
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
              {shippingCost && (
                <div className="flex items-center justify-between pt-5">
                  <p className="text-base leading-none text-gray-800 dark:text-white">
                    Shipping
                  </p>
                  <p className="text-base leading-none text-gray-800 dark:text-white">
                    ${shippingCost.standard / 100}
                  </p>
                </div>
              )}
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
                    className="h-auto w-auto rounded-full"
                    alt="user profile image"
                  />
                  <h3 className="text-lg text-skin-base">
                    {friendEntity.name}
                  </h3>
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
                      onClick={handleOnClick}
                      createOrder={handleCreateOrder}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <button
                    className="w-full border border-gray-800 bg-gray-900 py-5
              text-base leading-none text-white duration-150 ease-in-out focus:outline-none focus:ring-2 
              focus:ring-gray-800 focus:ring-offset-2 dark:hover:bg-gray-700"
                    onClick={() => setShowButtons(true)}
                  >
                    Pay Now!
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
