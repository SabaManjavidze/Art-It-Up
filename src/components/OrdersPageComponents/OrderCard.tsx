import React from "react"
import { Order } from "@prisma/client"
import Image from "next/image"
import type { RouterOutputs } from "../../utils/api"
import LineItemCard from "./LineItemCard"

interface OrderCardPropType { order: RouterOutputs["order"]["getMyOrders"][number] }
export default function OrderCard({ order }: OrderCardPropType) {
	const headerObj = [
		{
			title: "Order Number",
			content: order.id.slice(7, 13).toUpperCase()
		},
		{
			title: "Date Placed",
			content: new Date().toLocaleString()
		},
		{
			title: "Total Price",
			content: order.totalPrice
		},
	]

	return (
		<div className="flex-col flex mt-12">
			<div className="flex flex-col border rounded-md">
				<div className="gap-x-1.5 grid grid-cols-4">
					{
						headerObj.map(item => (
							<div key={item.content} className="text-center text-sm">
								<dt >{item.title}</dt>
								<dd >{item.content}</dd>
							</div>
						))
					}
				</div>
				{order.line_items.map(item => (
					<LineItemCard key={item.id} item={item} />
				))}
			</div>
		</div>
	)
}
