import React from "react";
import { useAxios } from "../../hooks/useAxios";
import OrderCard from "./OrderCard";

const Orders = () => {
  const { data: orders, loading } = useAxios("GET", `/order/userall/`);

  return (
    <div>
      <h1>Compras</h1>
      {!loading ? (
        <div className="profile-orders-container">
          {orders?.length ? (
            React.Children.toArray(orders?.map((e) => <OrderCard order={e} />))
          ) : (
            <p>Aún no tienes compras</p>
          )}
        </div>
      ) : (
        <p>LOADING</p>
      )}
      {/* //! VOLVER A VER agregar loader */}
    </div>
  );
};

export default Orders;
