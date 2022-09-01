import React from "react";
import { formatDate } from "../../helpers/formatDate";
import { resizer } from "../../helpers/resizer";
import { useAxios } from "../../hooks/useAxios";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import DeliveryProgress from "../common/DeliveryProgress";

const Orders = () => {
  const [notification] = useNotification();
  const { data: orders, loading } = useAxios("GET", `/order/userall/`);

  const cancelOrder = async (id) => {
    const { statusText } = await axios.put(`/order/${id}`, {
      status: "cancelled",
    });
    notification(
      `${
        statusText === "OK"
          ? "Dirección actualizada correctamente."
          : "Algo salió mal."
      }`,
      "",
      "warning"
    );
  };

  return (
    <div>
      <h1>Orders</h1>
      {!loading ? (
        <div className="profile-orders-container">
          {orders?.length ? (
            React.Children.toArray(
              orders?.map((e) => (
                <div className="profile-img-orders-container" key={e.id}>
                  {e.products?.map((pic) => (
                    <img key={pic.img} src={resizer(pic.img)} alt={"product"} />
                  ))}
                  <p>{e.description}</p>
                  <p>creation date: {formatDate(e.expiration_date_from)}</p>
                  {e.status === "pending" &&
                    `expiration: ${formatDate(e.expiration_date_to)}`}
                  <p>- - -</p>
                  <p>payment status: {e.status}</p>
                  {e.status === "approved" && (
                    <p>payment date: {formatDate(e.payment_date)}</p>
                  )}
                  {e.status === "pending" && e.payment_link && (
                    <div>
                      <a style={{ color: "#3483fa" }} href={e.payment_link}>
                        Continue payment.
                      </a>
                    </div>
                  )}
                  {
                    //! volver a ver: Quitar este botón ?
                  }
                  {e.status === "pending" && (
                    <button
                      onClick={() => cancelOrder(e._id)}
                      className="g-white-button"
                    >
                      Cancel order
                    </button>
                  )}

                  <p>{e.payment_source}</p>
                  <p>
                    order id: <i>{e.id}</i>
                  </p>
                  {e.delivery_date && <DeliveryProgress order={e} />}
                  <p>- - -</p>
                  <p>
                    shipping address:{" "}
                    {`
                            ${e.shipping_address?.street_name}
                            ${e.shipping_address?.street_number},
                            ${e.shipping_address?.city}
                        `}
                  </p>
                  <p>free shipping: {e.free_shipping ? "Yes" : "No"}</p>
                  <p>shipping cost: {e.shipping_cost}</p>
                  <p>total payment: ${e.total}</p>
                  <hr />
                  <br />
                </div>
              ))
            )
          ) : (
            <p>No orders yet</p>
          )}
        </div>
      ) : (
        <p>LOADING</p>
      )}
    </div>
  );
};

export default Orders;
