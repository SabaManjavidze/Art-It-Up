import type { UserAddress } from "@prisma/client";
import React, { useState } from "react";
import { Accordion } from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import AddressCard from "../ProfilePageComponents/AddressCard";
import PersonalDetailsSection from "../ProfilePageComponents/PersonalDetailsSection";
import Link from "next/link";
import { api } from "../../utils/api";

type ProfilePagePropTypes = {
  personalDetails: UserAddress[];
};
export const PublicKeys = {
  "country": "1",
  "region": "2",
  "address1": "3",
  "address2": "4",
  "zip": "5",
};
export const ProfilePage = ({ personalDetails }: ProfilePagePropTypes) => {
  return (
    <div className="min-h-screen bg-skin-main text-white">
      <section className="flex flex-col items-center border-b-2 border-white pb-10">
        <div className="w-1/2">
          <label className="block py-10 text-2xl">Your Addresses</label>
          <Accordion allowZeroExpanded>
            {personalDetails?.map((details) => (
              <AddressCard key={details.id} details={details} />
            ))}
          </Accordion>
          <Link href="/shipping-address" className="mt-4 block">
            + add another address
          </Link>
        </div>
      </section>
      <label className="ml-32 block py-10 text-2xl">Add Personal Details</label>
      <PersonalDetailsSection />
    </div>
  );
};
