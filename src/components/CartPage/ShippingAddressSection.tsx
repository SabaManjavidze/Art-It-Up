import { ClipLoader } from "react-spinners";
import { api } from "../../utils/api";
import AddressCard from "../ProfilePage/AddressCard";
import { Accordion } from "react-accessible-accordion";
import { useState } from "react";
import { SelectableCard } from "../UI/SelectableCard";

export const ShippingAddressSection = () => {
  const { data: addresses, isLoading } = api.user.getUserDetails.useQuery();
  const [selected, setSelected] = useState<string>("");
  const handleSelect = (id: string) => {
    setSelected(selected == id ? "" : id);
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
            addresses?.map((address) => (
              <SelectableCard
                handleSelect={() => handleSelect(address.id)}
                isSelected={selected == address.id}
                key={address.id}
              >
                <AddressCard details={address} />
              </SelectableCard>
            ))
          )}
        </Accordion>
      </div>
    </section>
  );
};
