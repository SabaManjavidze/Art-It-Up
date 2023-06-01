import React from "react"
import { ClipLoader } from "react-spinners"
import OrderCard from "../../components/OrdersPageComponents/OrderCard"
import { api } from "../../utils/api"

export default function OrdersPage() {
	const { data: orders, isLoading, error } = api.order.getMyOrders.useQuery()

	if (isLoading) return (
		<div className="flex h-screen items-center justify-center bg-skin-main">
			<ClipLoader color="white" />
		</div>
	)
	if (error) return (
		<div className="flex h-screen items-center justify-center bg-skin-main">
			There was an error
		</div>
	)

	return (
		<div>
			<div className="flex justify-center pb-20">
				<div className="w-3/5 mt-16 ">
					{
						orders.map(order => (

							<OrderCard key={order.id} order={order} />
						))
					}
				</div>
			</div>
		</div>
	)
}
