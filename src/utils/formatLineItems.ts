import type { RouterOutputs } from "./api";

type CartProduct = RouterOutputs["cart"]["getCart"][number];
type lineItemsType = "default" | "printify";
const lineItemsHandlers = {
  default: (item: CartProduct) => {
    return {
      quantity: item.quantity,
      productId: item.productId,
      variantId: item.variantId,
      styleId: item.styleId as string,
      cost: item.price,
    };
  },
  printify: (item: CartProduct) => {
    return {
      quantity: item.quantity,
      product_id: item.productId,
      variant_id: item.variantId,
    };
  },
};

export function formatLineItems<T extends lineItemsType>(
  products: CartProduct[],
  selected: string[],
  type?: T
): ReturnType<(typeof lineItemsHandlers)[T]>[] {
  const filtered_list: CartProduct[] = [];
  selected.forEach((prod_id) => {
    const product = products.find((prod) => prod.productId == prod_id);
    if (product) {
      filtered_list.push(product);
    }
  });
  const items = filtered_list.map((lineItemsHandlers as any)[type]) as any;
  return items;
}
