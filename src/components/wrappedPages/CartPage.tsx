import React, { useState } from "react";
import CartProductCard from "../CartProductCard";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import PresentModal from "../CartPageComponents/PresentModal";
import SummarySection from "../CartPageComponents/SummarySection";
import type { RouterOutputs } from "../../utils/api";
import { ShippingAddressSection } from "../CartPageComponents/ShippingAddressSection";
import { SelectableCard } from "../UI/SelectableCard";

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
      <div className="py-12">
        <ShippingAddressSection />
      </div>
      <div className="flex flex-col justify-end lg:flex-row">
        <div
          className="w-full py-4 pr-4 
        md:py-8 md:pr-6 lg:py-14 lg:pr-8"
        >
          <p className="ml-12 pt-9 text-3xl font-black leading-10 dark:text-white lg:text-4xl">
            Cart
          </p>

          <div className="mt-7">
            {products.length < 1 ? (
              <div className="mt-16 flex px-12">
                <p className="text-lg">No Products In Your Cart</p>
              </div>
            ) : (
              products.map((cartProduct, prodIdx) => {
                return (
                  <CartProduct
                    key={cartProduct.productId}
                    cartProduct={cartProduct}
                    prodIdx={prodIdx}
                  />
                );
              })
            )}
          </div>
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
}: {
  cartProduct: RouterOutputs["cart"]["getCart"][number];
  prodIdx: number;
}) {
  const { handleSelectProduct, selected } = useCheckout();

  return (
    <SelectableCard
      handleSelect={() => handleSelectProduct(cartProduct.productId)}
      isSelected={!!selected.find((item) => item == cartProduct.productId)}
    >
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
    </SelectableCard>
  );
}
