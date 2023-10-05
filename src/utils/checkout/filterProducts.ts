import type { UserCartProducts } from "@prisma/client";
import { Product } from "@prisma/client";

export const filterProducts = (
	products: UserCartProducts[],
	selected: string[],
	returnEmpty = false
) => {
	const isSelected = selected.length > 0;
	if (returnEmpty && !isSelected) return [];
	return isSelected
		? products.filter(({ productId }) => {
			return selected.find(item => item == productId)
		})
		: products;
};
