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
  name: string & ("Sizes" | "Colors");
  type: string;
  values: Value[];
}

export interface Value {
  id: number;
  title: string;
  colors?: string[];
  sizes?: string[];
}

export interface ShortVariant {
  id: number;
  price: number;
  is_enabled: boolean;
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
