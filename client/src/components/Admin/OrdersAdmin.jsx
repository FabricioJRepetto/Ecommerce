import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OrderCardAdmin from "./OrderCardAdmin";
import Checkbox from "../common/Checkbox";
import LoaderBars from "../common/LoaderBars";
import OrderDetails from "../Profile/OrderDetails";
import ReturnButton from "../common/ReturnButton";
import "./OrdersAdmin.css";

const ordersCheckboxesInitial = {
  approved: false,
  expired: false,
  pending: false,
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersFiltered, setOrdersFiltered] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderComplementaryData, setOrderComplementaryData] = useState(null);
  const [error, setError] = useState(null);
  const [ordersCheckboxes, setOrdersCheckboxes] = useState(
    ordersCheckboxesInitial
  );

  let ordersToShow;
  ordersFiltered.length
    ? (ordersToShow = ordersFiltered)
    : (ordersToShow = orders);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data } = await axios("/admin/order/getAll");
        setOrders(data);
      } catch (error) {
        console.log(error); //! VOLVER A VER manejo de errores
      } finally {
        setLoading(false);
      }
    })(); // eslint-disable-next-line
  }, []);

  const handleOrders = (e) => {
    setOrdersCheckboxes({
      ...ordersCheckboxes,
      [e.target.name]: !ordersCheckboxes[e.target.name],
    });
  };

  useEffect(() => {
    if (
      JSON.stringify(ordersCheckboxes) ===
      JSON.stringify(ordersCheckboxesInitial)
    ) {
      setOrdersFiltered([]);
    } else {
      let ordersAfterFilter = orders.filter(
        (order) => ordersCheckboxes[order.status] === true
      );
      ordersAfterFilter.length === 0
        ? setOrdersFiltered([null])
        : setOrdersFiltered(ordersAfterFilter);
    } // eslint-disable-next-line
  }, [ordersCheckboxes]);

  const getUserData = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios(`/admin/order/user/${id}`);
      if (data.error) {
        setError(data.message);
      } else {
        setOrderComplementaryData(data);
      }
    } catch (error) {
      console.log(error);
      //! VOLVER A VER manejo de errores
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`admin-all-orders-outer-container component-fadeIn${
        loading || Object.keys(orderDetails).length > 0
          ? " admin-all-orders-outer-container-loading"
          : ""
      }`}
    >
      {!loading ? (
        error ? (
          <h1>{error}</h1>
        ) : Object.keys(orderDetails).length > 0 ? (
          <>
            <h1>Resúmen de compra</h1>
            {orderComplementaryData && (
              <div className="admin-order-details-user-data">
                <div className="admin-order-card-userid">
                  <Link to={`/admin/users/${orderComplementaryData._id}`}>
                    <h3>Usuario {orderComplementaryData._id}</h3>
                  </Link>
                  <h3>{orderComplementaryData.name}</h3>
                  <h3>
                    {orderComplementaryData.isGoogleUser
                      ? orderComplementaryData.googleEmail
                      : orderComplementaryData.email}
                  </h3>
                </div>
              </div>
            )}
            <div className="admin-order-details-container">
              <OrderDetails
                order={orderDetails}
                removeOrderDetails={() => {
                  setOrderDetails({});
                  setOrderComplementaryData(null);
                }}
              />
              <ReturnButton
                to={"/admin/orders"}
                onClick={() => setOrderDetails({})}
              />
            </div>
          </>
        ) : (
          <>
            <h1>Órdenes</h1>
            <div className="admin-orders-checkboxes-container component-fadeIn">
              <label>
                <Checkbox
                  isChecked={ordersCheckboxes.approved}
                  extraStyles={{
                    border: true,
                    rounded: true,
                    innerBorder: true,
                    margin: ".05rem",
                    size: "1.2",
                  }}
                />
                <input
                  type="checkbox"
                  name="approved"
                  checked={ordersCheckboxes.approved}
                  onChange={handleOrders}
                />
                <span>Aprobadas</span>
              </label>
              <label>
                <Checkbox
                  isChecked={ordersCheckboxes.expired}
                  extraStyles={{
                    border: true,
                    rounded: true,
                    innerBorder: true,
                    margin: ".05rem",
                    size: "1.2",
                  }}
                />
                <input
                  type="checkbox"
                  name="expired"
                  checked={ordersCheckboxes.expired}
                  onChange={handleOrders}
                />
                <span>Expiradas</span>
              </label>
              <label>
                <Checkbox
                  isChecked={ordersCheckboxes.pending}
                  extraStyles={{
                    border: true,
                    rounded: true,
                    innerBorder: true,
                    margin: ".05rem",
                    size: "1.2",
                  }}
                />
                <input
                  type="checkbox"
                  name="pending"
                  checked={ordersCheckboxes.pending}
                  onChange={handleOrders}
                />
                <span>Pendientes</span>
              </label>
            </div>

            {ordersToShow.length > 0 ? (
              ordersToShow[0] === null ? (
                <h2>No hubieron coincidencias</h2>
              ) : (
                <div className="admin-all-orders-container-inner component-fadeIn">
                  {React.Children.toArray(
                    ordersToShow.map((order) => (
                      <OrderCardAdmin
                        order={order}
                        setOrderDetails={setOrderDetails}
                        getUserData={getUserData}
                      />
                    ))
                  )}
                </div>
              )
            ) : (
              <p>Aún no hay órdenes</p>
            )}
          </>
        )
      ) : (
        <LoaderBars />
      )}
    </div>
  );
};

export default OrdersAdmin;
