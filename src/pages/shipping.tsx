import React, { useState } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PDSchemaType } from "../utils/printify/printifyTypes";
import { personalDetailsSchema } from "../utils/printify/printifyTypes";
import { AddressObjectKeys } from "../utils/printify/printifyTypes";
import { nanoid } from "nanoid";
import { api } from "../utils/api";
import { countriesObj } from "../utils/countriesArray";
import { DetailsSection } from "../components/shipping/DetailsSection";

export default function Shipping() {
  const [expanded, setExpanded] = useState<string>("");
  const trpc = api.useContext();
  const { data: personalDetails } = api.user.getUserDetails.useQuery();

  const { mutateAsync: AddPersonalDetails } =
    api.user.addPersonalDetails.useMutation({
      onSuccess(data, variables, context) {
        trpc.user.getUserDetails.invalidate();
      },
    });

  const {
    register: PDForm,
    handleSubmit,
    formState,
  } = useForm<PDSchemaType>({
    resolver: zodResolver(personalDetailsSchema),
  });
  const onSubmit = async (data: PDSchemaType) => {
    await AddPersonalDetails({
      phone: data.phone,
      address: {
        ...data.address,
        country:
          countriesObj[data.address.country as keyof typeof countriesObj],
      },
    });
  };

  const handleItemExpand = (detailsId: string) => {
    const id = expanded ? "" : detailsId;
    return setExpanded(id);
  };
  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      {personalDetails && personalDetails.length > 0 ? (
        <DetailsSection
          expanded={expanded}
          personalDetails={personalDetails}
          handleItemExpand={handleItemExpand}
        />
      ) : (
        <div></div>
      )}
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-4 text-xl">Add New Shipping Address</h1>
        {AddressObjectKeys.map((key) => {
          if (key !== "country")
            return (
              <div className="flex justify-center pt-7 pb-4" key={nanoid()}>
                <input
                  className="rounded-sm bg-skin-secondary px-8 py-2 text-lg text-white"
                  placeholder={key}
                  type="text"
                  {...PDForm(`address.${key}`)}
                />
              </div>
            );
        })}
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}
