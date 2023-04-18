import { UserAddress } from "@prisma/client";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { PublicKeys } from "../wrappedPages/ProfilePage";
import { nanoid } from "nanoid";
type DetailsSectionPropType = {
  personalDetails: UserAddress[];
  handleItemExpand: (id: string) => void;
  expanded: string;
};
export const DetailsSection = ({
  personalDetails,
  handleItemExpand,
  expanded,
}: DetailsSectionPropType) => {
  return (
    <div>
      <label className="block py-10 text-2xl">Your Addresses</label>
      <Accordion allowZeroExpanded>
        {personalDetails?.map((details) => (
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
              {(Object.keys(details) as (keyof UserAddress)[]).map((key) => {
                if ((PublicKeys as any)[key])
                  return (
                    <p key={nanoid()}>
                      {key}: {details[key]}
                    </p>
                  );
              })}
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
