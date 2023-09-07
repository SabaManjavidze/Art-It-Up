import React from "react";
import { Loader2 } from "lucide-react";
import OrderCard from "../../components/ordersPageComponents/OrderCard";
import { api } from "../../utils/api";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = api.order.getMyOrders.useQuery();

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 color="white" />
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        There was an error
      </div>
    );

  return (
    <div>
      <div className="flex justify-center pb-20">
        <div className="mt-16 w-3/5 ">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
