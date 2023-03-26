import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { countries } from "../../utils/countriesArray";
import {
  AddressObjectKeys,
  PDSchemaType,
  personalDetailsSchema,
} from "../../utils/printify/printifyTypes";
import { nanoid } from "nanoid";
import { api } from "../../utils/api";

export default function ProfilePage() {
  const {
    register: PDForm,
    handleSubmit,
    formState,
  } = useForm<PDSchemaType>({
    resolver: zodResolver(personalDetailsSchema),
  });
  const { mutateAsync: AddPersonalDetails, isLoading } =
    api.user.addPersonalDetails.useMutation();
  const onSubmit = async (data: PDSchemaType) => {
    await AddPersonalDetails({
      ...data,
      address: {
        ...data.address,
        country: countries[data.address.country as keyof typeof countries],
      },
    });
  };

  return (
    <section className="min-h-screen bg-skin-main">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center pb-20"
      >
        <div className="flex flex-col items-center pt-7 pb-4">
          <h2 className="pb-5 text-lg text-white">
            {formState?.errors["phone"]?.message}
          </h2>
          <input
            className="rounded-sm bg-skin-secondary px-8 py-2 text-lg text-white"
            placeholder="Phone Number"
            type="number"
            {...PDForm("phone")}
          />
        </div>

        <div className="flex justify-center pt-7 pb-4" key={nanoid()}>
          <select
            className="overflow-y-scroll rounded-sm bg-skin-secondary px-8 py-2 text-lg text-white"
            {...PDForm(`address.country`)}
          >
            {Object.keys(countries).map((country) => (
              <option className="z-10">{country}</option>
            ))}
          </select>
        </div>
        <h2>{formState?.errors["address"]?.message}</h2>
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
        <div className="flex justify-center">
          <button
            className="w-32 bg-skin-secondary px-10 py-4 text-lg
             text-white duration-150 hover:bg-skin-light-secondary"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
