import { z } from "zod";

export const addressToSchema = z.object({
  title: z.string(),
  address1: z.string(),
  address2: z.string().optional(),
  country: z.string(),
  city: z.string(),
  region: z.string(),
  zip: z.string().length(4),
});
const AddressObjEnum = addressToSchema.keyof().Enum;
type AddressObjKeys = keyof typeof AddressObjEnum;
export const AddressObjectKeys = Object.keys(
  AddressObjEnum
) as AddressObjKeys[];

export type UserAddressSchemaType = z.infer<typeof addressToSchema>;

export const printifyLineItemsZT = z.array(
  z.object({
    product_id: z.string(),
    variant_id: z.number(),
    quantity: z.number(),
  })
);
export const lineItemsZT = z.array(
  z.object({
    productId: z.string(),
    variantId: z.number(),
    styleId: z.string(),
    quantity: z.number(),
    cost: z.number(),
  })
);
export const createOrderItemSchema = z.object({
  // external_id: z.string(),
  line_items: lineItemsZT,
  addressId: z.string(),
  totalShipping: z.number(),
  totalPrice: z.number(),
  // shipping_method: z.number(),
  // send_shipping_notification: z.boolean(),
});
export const personalDetailsSchema = z.object({
  firstName: z.string({
    required_error:
      "It is required to add your first name in your personal details",
  }),
  lastName: z.string({
    required_error:
      "It is required to add your last name in your personal details",
  }),
  phone: z.number({
    required_error:
      "It is required to add phone number in your personal details",
  }),
});
