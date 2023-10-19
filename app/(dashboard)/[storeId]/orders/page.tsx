"use client";

import { Loader, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  address: string;
  phone: string;
  isDelivered: boolean;
  isPaid: boolean;
  orderItems: {
    id: string;
    productId: string;
    orderId: string;
  }[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

async function fetchOrders(
  storeId: string,
  setOrders: Function,
  setLoading: Function
) {
  setLoading(true);
  const res = await fetch(`/api/stores/${storeId}/order`, {
    cache: "no-store",
  });
  setOrders(await res.json());
  setLoading(false);
}

export default function OrderPage({ params }: { params: { storeId: string } }) {
  const { storeId } = params;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders(storeId, setOrders, setLoading);
  }, []);

  const refetchOrders = () => fetchOrders(storeId, setOrders, setLoading);

  async function updatePaid(orderId: string, to: boolean) {
    const res = await fetch(`/api/stores/${storeId}/order`, {
      method: "PATCH",
      body: JSON.stringify({ orderId, isPaid: to }),
    });
    console.log("Updated isPaid:", await res.json());
    refetchOrders();
  }

  async function updateDelivered(orderId: string, to: boolean) {
    const res = await fetch(`/api/stores/${storeId}/order`, {
      method: "PATCH",
      body: JSON.stringify({ orderId, isDelivered: to }),
    });
    console.log("Updated isDelivered:", await res.json());
    refetchOrders();
  }

  return (
    <div className="flex flex-col items-center py-4">
      {loading && !orders.length ? (
        <Loader2 className="w-8 h-8 animate-spin" />
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th>Id</th>
              <th>Address</th>
              <th>Summa att betala</th>
              <th>Levererad</th>
              <th>Betald</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {orders.map((order: Order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.address}</td>
                <td>{order.totalPrice}kr</td>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={order.isDelivered}
                    onChange={() =>
                      updateDelivered(order.id, !order.isDelivered)
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={order.isPaid}
                    onChange={() => updatePaid(order.id, !order.isPaid)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {orders.length === 0 && !loading ? (
        <p className="mt-4">Ingen verkar ha lagt någon order hos dig 😢</p>
      ) : null}
    </div>
  );
}
