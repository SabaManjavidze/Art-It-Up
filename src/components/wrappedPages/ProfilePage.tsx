import { zodResolver } from "@hookform/resolvers/zod";
import type { UserAddress } from "@prisma/client";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { useForm } from "react-hook-form";
import { api } from "../../utils/api";
import { countriesArr, countriesObj } from "../../utils/countriesArray";
import type { PDSchemaType } from "../../utils/printify/printifyTypes";
import {
  AddressObjectKeys,
  personalDetailsSchema,
} from "../../utils/printify/printifyTypes";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import SelectSearch from "react-select-search";
import type { SelectSearchProps } from "react-select-search/src/index";
import "react-accessible-accordion/dist/fancy-example.css";

type ProfilePagePropTypes = {
  personalDetails: UserAddress[];
};
const PublicKeys = {
  "country": "1",
  "region": "2",
  "address1": "3",
  "address2": "4",
  "zip": "5",
};
export const ProfilePage = ({ personalDetails }: ProfilePagePropTypes) => {
  const {
    register: PDForm,
    handleSubmit,
    formState,
  } = useForm<PDSchemaType>({
    resolver: zodResolver(personalDetailsSchema),
  });
  const [expanded, setExpanded] = useState<string>("");
  const trpc = api.useContext();
  const { mutateAsync: AddPersonalDetails } =
    api.user.addPersonalDetails.useMutation({
      onSuccess(data, variables, context) {
        trpc.user.getUserDetails.invalidate();
      },
    });
  const renderOption: SelectSearchProps["renderOption"] = (
    domProps,
    option
  ) => {
    return (
      <button
        {...option}
        className="mt-2 ml-3 cursor-pointer py-1 duration-150 hover:opacity-80"
      >
        {option.name}
      </button>
    );
  };
  const onSubmit = async (data: PDSchemaType) => {
    await AddPersonalDetails({
      ...data,
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
    <section className="min-h-screen bg-skin-main text-white">
      <section className="flex flex-col items-center border-b-2 border-white pb-10">
        <div className="w-1/2">
          <label className="block py-10 text-2xl">Your Addresses</label>
          <Accordion allowZeroExpanded>
            {personalDetails.map((details) => (
              <AccordionItem
                key={details.id}
                onClick={() => handleItemExpand(details.id)}
              >
                <AccordionItemHeading>
                  <AccordionItemButton
                    className="flex w-full items-center border-none 
                  bg-skin-secondary p-4 text-left"
                  >
                    {expanded == details.id ? (
                      <AiOutlineCaretDown color="white" size={30} />
                    ) : (
                      <AiOutlineCaretRight color="white" size={30} />
                    )}
                    <p className="ml-3 text-lg">{details.title}</p>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="animate-fadein p-5">
                  {(Object.keys(details) as (keyof UserAddress)[]).map(
                    (key) => {
                      if ((PublicKeys as any)[key])
                        return (
                          <p key={nanoid()}>
                            {key}: {details[key]}
                          </p>
                        );
                    }
                  )}
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
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
            placeholder="phone"
            type="number"
            {...PDForm("phone")}
          />
        </div>

        <div className="flex justify-center pt-7 pb-4">
          <SelectSearch
            options={countriesArr}
            renderOption={(domProps, option, snapshot, className) => {
              return (
                <button
                  {...(domProps as any)}
                  className="font-xl relative block w-full bg-skin-secondary px-10 py-4
            text-left leading-loose text-neutral-200 duration-150 hover:bg-skin-light-secondary
            hover:text-white"
                >
                  {option.name}
                </button>
              );
            }}
            autoComplete="on"
            closeOnSelect
            search
            placeholder="Country"
          />
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
};
