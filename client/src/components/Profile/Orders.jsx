import React from "react";
import { useAxios } from "../../hooks/useAxios";
import LoaderBars from "../common/LoaderBars";
import OrderCard from "./OrderCard";
import "./Orders.css";

const Orders = () => {
  const { data: orders, loading } = useAxios("GET", `/order/userall/`);

  return (
    <div className="profile-all-orders-container">
      {!loading ? (
        <>
          <h1>Compras</h1>
          <div className="profile-orders-container">
            {orders?.length ? (
              React.Children.toArray(
                orders?.map((e) => <OrderCard order={e} />)
              )
            ) : (
              <p>Aún no tienes compras</p>
            )}
          </div>
        </>
      ) : (
        <LoaderBars />
      )}
    </div>
  );
};

export default Orders;
