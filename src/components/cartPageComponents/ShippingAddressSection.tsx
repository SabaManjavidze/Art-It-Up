import { Loader2 } from "lucide-react";
import { api } from "../../utils/api";
import AddressCard from "../profilePageComponents/AddressCard";
import { SelectableCard } from "../ui/SelectableCard";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { useEffect, useState } from "react";
import Link from "next/link";

export const ShippingAddressSection = () => {
  const {
    address,
    setAddress,
    userDetails: addresses,
    detailsLoading: isLoading,
    setValuesChanged,
  } = useCheckout();
  const [expanded, setExpanded] = useState("");
  const handleSelect = (id: string) => {
    setAddress(address == id ? "" : id);
    setValuesChanged(true);
  };
  useEffect(() => {
    if (!isLoading) {
      const selectedAddr = addresses?.find((item) => item.selected == true);
      if (selectedAddr) {
        setAddress(selectedAddr.id);
      }
    }
  }, [isLoading]);
  return (
    <section className="bg-background px-5 md:px-20">
      <h2 className="text-3xl">Shipping Address</h2>
      <div className="mt-5 grid grid-cols-1 gap-y-4 gap-x-10 md:grid-cols-2 md:gap-x-20 md:px-8 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 size={200} color={"white"} />
          </div>
        ) : (
          addresses?.map((addressItem) => (
            <SelectableCard
              handleSelect={() => handleSelect(addressItem.id)}
              isSelected={address == addressItem.id}
              key={addressItem.id}
            >
              <AddressCard
                details={addressItem}
                expanded={expanded == addressItem.id}
                handleHeaderClick={() =>
                  setExpanded(expanded == addressItem.id ? "" : addressItem.id)
                }
              />
            </SelectableCard>
          ))
        )}
      </div>
      <div className="mt-4">
        <Link href="/shipping-address" className="hover:text-accent-foreground">
          + add address
        </Link>
      </div>
    </section>
  );
};
