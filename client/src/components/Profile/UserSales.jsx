import React from "react";
import LoaderBars from "../common/LoaderBars";
import "./UserSales.css";

const UserSales = ({ loading, sales }) => {
  return (
    <div className="component-fadeIn">
      {!loading ? (
        <div>
          <h1>Ventas</h1>
          <div>
            {sales?.length ? <></> : <p>Aún no has vendido ningún produco</p>}
          </div>
        </div>
      ) : (
        <LoaderBars />
      )}
    </div>
  );
};

export default UserSales;
