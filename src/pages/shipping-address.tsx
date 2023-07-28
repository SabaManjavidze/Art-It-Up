import React from "react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import { countriesArr, countriesObj } from "../utils/countriesArray";
import type { PDSchemaType } from "../utils/printify/printifyTypes";
import {
  AddressObjectKeys,
  addressToSchema,
} from "../utils/printify/printifyTypes";
import AutoCompleteSearch from "../components/ui/AutoCompleteSearch";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ShippingAddress() {
  const trpc = api.useContext();
  const { mutateAsync: AddPersonalDetails } =
    api.user.addShippingAddress.useMutation({
      onSuccess() {
        trpc.user.getUserAddress.invalidate();
      },
    });
  const {
    register: AddressForm,
    handleSubmit,
    formState,
  } = useForm<PDSchemaType>({
    resolver: zodResolver(addressToSchema),
  });

  const onSubmit = async (data: PDSchemaType) => {
    if (!data) return;
    await AddPersonalDetails({
      ...data,
      country: countriesObj[data.country as keyof typeof countriesObj],
    });
  };
  const { ref: innerRef, ...autoCompleteArgs } = AddressForm("country");
  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log(err);
      })}
      className="flex flex-col items-center justify-center pb-20"
    >
      <div className="w-72">
        <div className="flex w-full justify-center pt-4 pb-2 ">
          <AutoCompleteSearch
            arr={countriesArr}
            placeholder="country"
            innerRef={innerRef}
            {...autoCompleteArgs}
          />
        </div>

        {AddressObjectKeys.map((key) => {
          if (key !== "country")
            return (
              <div
                className="mb-4 flex w-full justify-center pt-7"
                key={nanoid()}
              >
                <h2 className="text-2xl text-primary-foreground">
                  {formState?.errors[key]?.message}
                </h2>
                <input
                  className="w-full rounded-sm bg-secondary py-2 text-lg text-primary-foreground"
                  placeholder={key}
                  type="text"
                  {...AddressForm(key)}
                />
              </div>
            );
        })}
      </div>
      <div className="flex justify-center">
        <button
          className="my-4 w-32 bg-secondary px-10 text-lg
             text-primary-foreground duration-150 hover:bg-secondary/90 active:scale-105"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
