import { z } from "zod";
export interface PrintifyGetShopProductsResponse {
  current_page: number;
  data: PrintifyProductType[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface PrintifyProductType {
  id: string;
  title: string;
  description: string;
  tags: string[];
  options: Option[];
  variants: Variant[];
  images: Image[];
  created_at: string;
  updated_at: string;
  visible: boolean;
  is_locked: boolean;
  blueprint_id: number;
  user_id: number;
  shop_id: number;
  print_provider_id: number;
  print_areas: PrintArea[];
  print_details: { print_on_side: "regular" | "mirror" | "off" };
  sales_channel_properties: [] | null;
  twodaydelivery_enabled: boolean;
}

export interface Option {
  name: string & ("Sizes" | "Color");
  type: string;
  values: Value[];
}

export interface Value {
  id: number;
  title: string;
  colors?: string[];
  sizes?: string[];
}

export interface Variant {
  id: number;
  sku: string;
  cost: number;
  price: number;
  title: string;
  grams: number;
  is_enabled: boolean;
  is_default: boolean;
  is_available: boolean;
  options: number[];
  quantity: number;
}

export interface Image {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
  is_selected_for_publishing: boolean;
}

export interface PrintArea {
  variant_ids: number[];
  placeholders: Placeholder[];
  background?: string;
  font_color?: string;
  font_family?: string;
}

export interface Placeholder {
  position: string;
  images: Image2[];
}

export interface Image2 {
  id: string;
  name: string;
  type: string;
  height: number;
  width: number;
  x: number;
  y: number;
  scale: number;
  angle: number;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export interface PrintifyGetProductResponse {
  id: string;
  title: string;
  description: string;
  tags: string[];
  options: Option[];
  variants: Variant[];
  images: Image[];
  created_at: string;
  updated_at: string;
  visible: boolean;
  is_locked: boolean;
  blueprint_id: number;
  user_id: number;
  shop_id: number;
  print_provider_id: number;
  print_areas: PrintArea[];
  sales_channel_properties: [] | null;
}

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

export type PDSchemaType = z.infer<typeof addressToSchema>;

export const lineItemsZodType = z.array(
  z.object({
    product_id: z.string(),
    variant_id: z.number(),
    quantity: z.number(),
  })
);
export const createOrderItemSchema = z.object({
  // external_id: z.string(),
  line_items: lineItemsZodType,
  entityId: z.string().optional(),
  addressId: z.string(),
  totalShipping: z.number(),
  totalPrice: z.number(),
  // shipping_method: z.number(),
  // send_shipping_notification: z.boolean(),
});
