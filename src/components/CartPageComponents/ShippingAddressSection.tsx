import { Loader2 } from "lucide-react";
import { api } from "../../utils/api";
import AddressCard from "../ProfilePageComponents/AddressCard";
import { SelectableCard } from "../ui/SelectableCard";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { useEffect, useState } from "react";

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
    <section className="bg-background">
      <h2 className="ml-12 text-3xl">Shipping Address</h2>
      <div className="mt-5 grid grid-cols-1 gap-4 gap-x-10 px-8 md:grid-cols-2 md:gap-x-20 lg:grid-cols-3 xl:grid-cols-4">
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
    </section>
  );
};
