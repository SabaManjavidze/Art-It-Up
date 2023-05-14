import type { Product, UserCartProducts } from "@prisma/client";

export const formatLineItems = async (
  products: (UserCartProducts & {
    product: Product;
  })[],
  selected: string[]
) => {
  const filtered_list: (UserCartProducts & {
    product: Product;
  })[] = [];
  selected.forEach((prod_id) => {
    const product = products.find(prod=>prod.productId==prod_id)
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
  });
  return line_items;
};
