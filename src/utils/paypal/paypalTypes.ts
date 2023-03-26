export interface Root {
  id: string;
  status: string;
  payment_source: PaymentSource;
  purchase_units: PurchaseUnit[];
  payer: Payer;
  links: Link2[];
}

export interface PaymentSource {
  paypal: Paypal;
}

export interface Paypal {
  name: Name;
  email_address: string;
  account_id: string;
}

export interface Name {
  given_name: string;
  surname: string;
}

export interface PurchaseUnit {
  reference_id: string;
  shipping: Shipping;
  payments: Payments;
}

export interface Shipping {
  address: Address;
}

export interface Address {
  address_line_1: string;
  address_line_2: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

export interface Payments {
  captures: Capture[];
}

export interface Capture {
  id: string;
  status: string;
  amount: Amount;
  seller_protection: SellerProtection;
  final_capture: boolean;
  disbursement_mode: string;
  seller_receivable_breakdown: SellerReceivableBreakdown;
  create_time: string;
  update_time: string;
  links: Link[];
}

export interface Amount {
  currency_code: string;
  value: string;
}

export interface SellerProtection {
  status: string;
  dispute_categories: string[];
}

export interface SellerReceivableBreakdown {
  gross_amount: GrossAmount;
  paypal_fee: PaypalFee;
  net_amount: NetAmount;
}

export interface GrossAmount {
  currency_code: string;
  value: string;
}

export interface PaypalFee {
  currency_code: string;
  value: string;
}

export interface NetAmount {
  currency_code: string;
  value: string;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface Payer {
  name: Name2;
  email_address: string;
  payer_id: string;
}

export interface Name2 {
  given_name: string;
  surname: string;
}

export interface Link2 {
  href: string;
  rel: string;
  method: string;
}
