import { Product, UserCartProducts } from "@prisma/client";

export const formatLineItems = async (
  products: (UserCartProducts & {
    product: Product;
  })[],
  selected: number[]
) => {
  const filtered_list: (UserCartProducts & {
    product: Product;
  })[] = [];
  selected.forEach((prod_idx) => {
    const product = products?.[prod_idx];
    if (product) {
      filtered_list.push(product);
    }
  });

  const line_items = filtered_list.map((product) => {
    return {
      quantity: product.quantity,
      product_id: product.productId,
      variant_id: product.variantId,
    };
  }) as [
    {
      quantity: number;
      product_id: string;
      variant_id: string;
    }
  ];
  return line_items;
};
