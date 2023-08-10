import React from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import Link from "next/link"

type SearchResultsPagePropType = {
	query: string;
	tags?: string[];
};
export const SearchResultsPage = ({
	query,
	tags,
}: SearchResultsPagePropType) => {
	const { data: products, isLoading: productsLoading } =
		api.printify.searchProducts.useQuery({ name: query, tags });
	return (
		<div className="absolute min-h-screen bg-background">
			{products
				? products.map((product) => (
					<div
						key={product.id}
						className="my-16 mx-64 flex h-48 justify-center md:mx-0 "
					>
						<Link
							href={`/product/${product.id}`}
							className="flex w-2/3 items-center rounded-lg 
              border border-gray-200 bg-white shadow hover:bg-gray-100
              dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
						>
							<div className="relative h-48 w-full">
								<Image
									className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
									fill
									src={product.picture}
									alt=""
								/>
							</div>
							<div className="flex max-h-48 flex-col justify-between p-4 leading-normal">
								<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-primary-foreground">
									{product.title}
								</h5>
								<p
									dangerouslySetInnerHTML={{ __html: product.description }}
									className="mb-3 h-4/5 overflow-y-scroll font-normal text-gray-700 dark:text-gray-400"
								></p>
							</div>
						</Link>
					</div>
				))
				: null}
		</div>
	);
};
