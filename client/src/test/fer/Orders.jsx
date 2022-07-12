import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "./OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios("/order/adminall")
      .then(({ data }) => {
        setOrders(data);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  }, []);

  return (
    <div>
      <div>orders</div>

      {orders.length ? (
        React.Children.toArray(
          orders.map((order) => <OrderCard order={order} />)
        )
      ) : (
        <p>No orders yet</p>
      )}
    </div>
  );
};

export default Orders;
