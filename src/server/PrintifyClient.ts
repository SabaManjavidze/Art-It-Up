import PrintifyClient from "@kastlabs/printify-client";
import type { z } from "zod";
import type { lineItemsZT, printifyLineItemsZT } from "../utils/types/zodTypes";
import { addressToSchema } from "../utils/types/zodTypes";
import type {
  PrintifyProductType,
  ShortVariant} from "@/utils/printify/printifyTypes";
import {
  PrintArea,
  Variant,
} from "@/utils/printify/printifyTypes";
import type { printAreaSchema } from "@/utils/printify/printifyZod";
const addressWithoutTitle = addressToSchema.omit({ title: true });
type userDetails = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export class Printify extends PrintifyClient {
  public async uploadImage({
    url,
    file_name,
  }: {
    url: string;
    file_name: string;
  }): Promise<{
    id: string;
    file_name: string;
    height: number;
    width: number;
    size: number;
    mime_type: string;
    preview_url: string;
    upload_time: string;
  }> {
    return this.invoke(`/uploads/images.json`, {
      method: "POST",
      body: JSON.stringify({
        url,
        file_name,
      }),
    });
  }
  public async deleteProduct({ id }: { id: string }): Promise<null> {
    return this.invoke(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/products/${id}.json`,
      {
        method: "DELETE",
      }
    );
  }
  public async createProduct({
    title,
    blueprint_id,
    print_provider_id,
    variants,
    print_areas,
  }: {
    title: string;
    blueprint_id: number;
    print_provider_id: number;
    variants: ShortVariant[];
    print_areas: z.infer<typeof printAreaSchema>[];
  }): Promise<PrintifyProductType> {
    return this.invoke(`/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`, {
      method: "POST",
      body: JSON.stringify({
        title,
        blueprint_id,
        variants,
        print_provider_id,
        print_areas,
      }),
    });
  }
  public async calculateShipping(
    address_to: z.infer<typeof addressWithoutTitle>,
    line_items: z.infer<typeof printifyLineItemsZT>,
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
export const printify = new Printify({
  apiKey: process.env.PRINTIFY_ACCESS_TOKEN as string,
  shopId: process.env.PRINTIFY_SHOP_ID,
});
