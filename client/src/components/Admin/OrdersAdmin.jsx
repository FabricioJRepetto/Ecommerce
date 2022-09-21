import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCardAdmin from "./OrderCardAdmin";

const ordersCheckboxesInitial = {
  approved: false,
  expired: false,
  pending: false,
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [ordersFiltered, setOrdersFiltered] = useState([]);
  const [ordersCheckboxes, setOrdersCheckboxes] = useState(
    ordersCheckboxesInitial
  );

  let ordersToShow;
  ordersFiltered.length
    ? (ordersToShow = ordersFiltered)
    : (ordersToShow = orders);

  useEffect(() => {
    axios("/admin/order/getAll")
      .then(({ data }) => {
        setOrders(data);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
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
    }
    
  }, [ordersCheckboxes]);

  return (
    <div className="component-fadeIn">
      <h2>ÓRDENES</h2>
      <label>
        <input
          type="checkbox"
          name="approved"
          checked={ordersCheckboxes.approved}
          onChange={handleOrders}
        />
        Aprobadas
      </label>
      <label>
        <input
          type="checkbox"
          name="expired"
          checked={ordersCheckboxes.expired}
          onChange={handleOrders}
        />
        Expiradas
      </label>
      <label>
        <input
          type="checkbox"
          name="pending"
          checked={ordersCheckboxes.pending}
          onChange={handleOrders}
        />
        Pendientes
      </label>

      {ordersToShow.length ? (
        ordersToShow[0] === null ? (
          <h2>No hubieron coincidencias</h2>
        ) : (
          React.Children.toArray(
            ordersToShow.map((order) => <OrderCardAdmin order={order} />)
          )
        )
      ) : (
        <p>Aún no hay órdenes</p>
      )}
    </div>
  );
};

export default OrdersAdmin;
