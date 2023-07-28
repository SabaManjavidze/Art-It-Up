import { Loader2 } from "lucide-react";
import { api } from "../../utils/api";
import AddressCard from "../ProfilePageComponents/AddressCard";
import { SelectableCard } from "../ui/SelectableCard";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { useEffect } from "react";

export const ShippingAddressSection = () => {
  const {
    address,
    setAddress,
    userDetails: addresses,
    detailsLoading: isLoading,
  } = useCheckout();
  const handleSelect = (id: string) => {
    setAddress(address == id ? "" : id);
  };
  useEffect(() => {
    if (!isLoading) {
      const selectedAddr = addresses?.find((item) => item.selected == true);
      if (selectedAddr) setAddress(selectedAddr.id);
    }
  }, [isLoading]);
  return (
    <section className="bg-background">
      <h2 className="ml-12 text-3xl">Shipping Address</h2>
      <div className="mt-5 flex justify-start">
        {isLoading ? (
          <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 size={200} color={"white"} />
          </div>
        ) : (
          addresses?.map((addressItem) => (
            <SelectableCard
              handleSelect={() => handleSelect(addressItem.id)}
              isSelected={address == addressItem.id || addressItem.selected}
              key={addressItem.id}
            >
              <AddressCard details={addressItem} />
            </SelectableCard>
          ))
        )}
      </div>
    </section>
  );
};
