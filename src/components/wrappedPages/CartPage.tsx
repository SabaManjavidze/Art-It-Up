import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import CartProductCard from "../../components/CartProductCard";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import { IoCloseCircle } from "react-icons/io5";
import PresentModal from "../CartPage/PresentModal";
import SummarySection from "../CartPage/SummarySection";
import { RouterOutputs } from "../../utils/api";

export default function CartPage() {
  const { products, shippingCost } = useCheckout();
  const [showPresentModal, setShowPresentModal] = useState(false);

  return (
    <div className="min-h-screen w-full bg-skin-main text-skin-base ">
      {showPresentModal && (
        <PresentModal
          showPresentModal={showPresentModal}
          setShowPresentModal={setShowPresentModal}
        />
      )}
      <div className="flex flex-col justify-end lg:flex-row">
        <div
          className="w-full py-4 pr-4 
        md:py-8 md:pr-6 lg:py-14 lg:pr-8"
        >
          <p className="ml-12 pt-3 text-3xl font-black leading-10 dark:text-white lg:text-4xl">
            Cart
          </p>

          {products.length < 1 ? (
            <div className="mt-16 flex px-12">
              <p className="text-lg">No Products In Your Cart</p>
            </div>
          ) : (
            products.map((cartProduct, prodIdx) => {
              return (
                <CartProduct cartProduct={cartProduct} prodIdx={prodIdx} />
              );
            })
          )}
        </div>
        <div className="mt-32 mr-5 h-full w-full bg-gray-100 dark:bg-gray-800 md:w-full lg:w-96">
          {products.length > 0 && shippingCost && (
            <SummarySection
              setShowPresentModal={setShowPresentModal}
              showPresentModal={showPresentModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CartProduct({
  cartProduct,
  prodIdx,
}: {
  cartProduct: RouterOutputs["cart"]["getCart"][number];
  prodIdx: number;
}) {
  const {
    handleSelectProduct,
    selected,
    handleRemoveCartProduct,
    removeProductLoading,
  } = useCheckout();
  return (
    <div
      key={cartProduct.productId}
      className="flex items-center border-none bg-transparent"
    >
      <div className="flex w-32 items-center justify-center px-4">
        <button onClick={() => handleSelectProduct(prodIdx)}>
          {selected.find((idx) => idx == prodIdx) !== undefined ? (
            <BiRadioCircleMarked size={30} color="white" />
          ) : (
            <BiRadioCircle size={30} color="white" />
          )}
        </button>
      </div>

      <div className="relative ">
        <div className="absolute top-10 right-5">
          <button
            className="cursor-pointer pl-5 text-xs leading-3 text-red-500 underline duration-150 hover:scale-105"
            onClick={() => handleRemoveCartProduct(prodIdx)}
            title="Remove Product"
          >
            {removeProductLoading ? (
              <ClipLoader color="white" />
            ) : (
              <IoCloseCircle size={30} className="text-red-500" />
            )}
          </button>
        </div>
        <CartProductCard
          key={cartProduct.productId}
          title={cartProduct.product.title}
          src={cartProduct.product.picture}
          productId={cartProduct.productId}
          quantity={cartProduct.quantity}
          href={`/product/${cartProduct.productId}`}
          description={cartProduct.product.description}
          price={cartProduct.price / 100}
        />
      </div>
    </div>
  );
}
