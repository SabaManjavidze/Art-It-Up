
export const filterProducts = (products: any[], selected: number[], returnEmpty: boolean = false) => {

	const isSelected = selected.length > 0;
	if (returnEmpty && !isSelected) return []
	return isSelected
		? products.filter((_, prodIdx) => prodIdx == selected[prodIdx])
		: products;
}
