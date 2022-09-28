import React from "react";
import LoaderBars from "../common/LoaderBars";
import SaleCard from "./SaleCard";
import "./UserSales.css";

const UserSales = ({ loading, sales }) => {
  return (
    <div className="profile-all-orders-container component-fadeIn">
      {!loading ? (
        <>
          <h1>Ventas</h1>
          <div className="profile-orders-container component-fadeIn">
            {sales?.length ? (
              React.Children.toArray(sales.map((s) => <SaleCard sale={s} />))
            ) : (
              <p>Aún no has vendido ningún produco</p>
            )}
          </div>
        </>
      ) : (
        <LoaderBars />
      )}
    </div>
  );
};

export default UserSales;
