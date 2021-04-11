import React, { useEffect, useState } from "react";

interface OrdersProps {
  region: string;
}

export interface OrderModel {
  duration: number;
  is_buy_order: boolean;
  issued: string;
  location_id: number;
  min_volume: number;
  order_id: number;
  price: number;
  range: string;
  system_id: number;
  type_id: number;
  volume_remain: number;
  volume_total: number;
}

const Orders = (props: OrdersProps) => {
  const { region } = props;
  const [orders, setOrders] = useState<OrderModel[]>([]);
  useEffect(() => {
    fetch(`https://esi.evetech.net/latest/markets/${region}/orders`).then((r) =>
      r.json().then((orders) => setOrders(orders))
    );
  }, [region]);
  return (
    <table>
      <tbody>
        {orders.map((order) => (
          <tr>
            <td>{order.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Orders;
