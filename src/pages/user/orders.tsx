import React from "react";
import { Loader2 } from "lucide-react";
import OrderCard from "../../components/ordersPageComponents/OrderCard";
import { api } from "../../utils/api";
import Image from "next/image";

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
      <div className="mt-40 flex justify-center">
        <div className="relative h-96 w-96">
          <Image
            src="https://images-api.printify.com/mockup/64c4fb6899a1cfac1f06b8d7/25458/98502/unisex-heavy-blend-crewneck-sweatshirt.jpg?camera_label=front"
            alt=""
            fill
          />
          <div className="tranlsate-y-1/2 absolute bottom-1/2 right-1/2 translate-x-1/2">
            <div className="relative h-32 w-32">
              <Image src="https://i.redd.it/t3wk3u58ypy61.png" alt="" fill />
            </div>
          </div>
        </div>
        {/* <div className="mt-16 w-3/5 ">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div> */}
      </div>
    </div>
  );
}
