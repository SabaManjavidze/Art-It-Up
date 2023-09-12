import React from "react"
import Image from "next/image"
import type { RouterOutputs } from "../../utils/api"


export default function LineItemCard({ item }: { item: RouterOutputs["order"]["getMyOrders"][number]["line_items"][number] }) {

	return (

		<div className="border flex-col flex min-h-56 py-2">
			<div className="flex items-center">
				<div className="w-[10rem] h-[10rem] relative">
					<Image
						fill
						src={item.product.picture}
						alt="product preview"
					/>
				</div>
				<div className="flex flex-1 flex-col ml-4">
					<div className="flex px-3 justify-between">
						<h5>{item.product.title}</h5>
						<p className="m-0">${item.cost}</p>
					</div>
					<p className="mt-4 block text-sm overflow-y-scroll max-h-40" dangerouslySetInnerHTML={{ __html: item.product.description }}>
					</p>
				</div>

			</div>
			<div>
				<h5 className="pl-4 text-sm">
					Quantity: {item.quantity}
				</h5>
			</div>
		</div>
	)
}
