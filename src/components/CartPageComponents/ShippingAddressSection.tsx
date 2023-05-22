import { ClipLoader } from "react-spinners";
import { api } from "../../utils/api";
import AddressCard from "../ProfilePageComponents/AddressCard";
import { Accordion } from "react-accessible-accordion";
import { SelectableCard } from "../UI/SelectableCard";
import { useCheckout } from "../../hooks/useCheckoutHooks";

export const ShippingAddressSection = () => {
  const { address, setAddress } = useCheckout();
  const { data: addresses, isLoading } = api.user.getUserDetails.useQuery();
  const handleSelect = (id: string) => {
    setAddress(address == id ? "" : id);
  };
  return (
    <section>
      <h2 className="ml-12 text-3xl">Shipping Address</h2>
      <div className="mt-5 flex justify-start">
        <Accordion className="ml-12 w-1/2" allowZeroExpanded>
          {isLoading ? (
            <div className="flex min-h-screen w-full items-center justify-center bg-skin-main">
              <ClipLoader size={200} color={"white"} />
            </div>
          ) : (
            addresses?.map((addressItem) => (
              <SelectableCard
                handleSelect={() => handleSelect(addressItem.id)}
                isSelected={address == addressItem.id||addressItem.selected}
                key={addressItem.id}
              >
                <AddressCard details={addressItem} />
              </SelectableCard>
            ))
          )}
        </Accordion>
      </div>
    </section>
  );
};
