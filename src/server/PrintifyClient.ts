import PrintifyClient from "@kastlabs/printify-client";
import type { z } from "zod";
import type {
  lineItemsZodType} from "../utils/printify/printifyTypes";
import {
  addressToSchema
} from "../utils/printify/printifyTypes";
const addressWithoutTitle = addressToSchema.omit({ title: true });
type userDetails = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export class Printify extends PrintifyClient {
  public async calculateShipping(
    address_to: z.infer<typeof addressWithoutTitle>,
    line_items: z.infer<typeof lineItemsZodType>,
    userDetails: userDetails
  ): Promise<{ standard: number; express: number }> {
    return this.invoke(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/orders/shipping.json`,
      {
        method: "POST",
        body: JSON.stringify({
          address_to: { ...userDetails, ...address_to },
          line_items,
        }),
      }
    );
  }
}
