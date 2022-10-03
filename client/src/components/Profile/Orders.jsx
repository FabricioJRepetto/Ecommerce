import React, { useState } from "react";
import LoaderBars from "../common/LoaderBars";
import OrderCard from "./OrderCard";
import OrderDetails from "./OrderDetails";
import ReturnButton from "../common/ReturnButton";
import "./Orders.css";

const Orders = ({ orders, loading }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  return (
    <div className="profile-all-orders-container component-fadeIn">
      {!loading ? (
        orderDetails ? (
          <>
            {" "}
            <h1>Resúmen</h1>
            <OrderDetails
              order={orderDetails}
              removeOrderDetails={() => setOrderDetails(null)}
            />
            <ReturnButton
              to={"/profile/orders"}
              onClick={() => setOrderDetails(null)}
            />
          </>
        ) : (
          <>
            <h1>Compras</h1>
            <div className="profile-orders-container component-fadeIn">
              {orders?.length ? (
                React.Children.toArray(
                  orders?.map((e) => (
                    <OrderCard order={e} setOrderDetails={setOrderDetails} />
                  ))
                )
              ) : (
                <p>Aún no tienes compras</p>
              )}
            </div>
          </>
        )
      ) : (
        <div className="profile-loader-container">
          <LoaderBars />
        </div>
      )}
    </div>
  );
};

export default Orders;
