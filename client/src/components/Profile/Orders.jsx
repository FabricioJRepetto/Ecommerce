import React from "react";
import { formatDate } from "../../helpers/formatDate";
import { resizer } from "../../helpers/resizer";
import { useAxios } from "../../hooks/useAxios";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import { deliveryPercent } from "../../helpers/deliveryPercent";
import { correctStyle } from "../../helpers/correctStyle";
import { ReactComponent as Gift } from "../../assets/svg/gift.svg";

const Orders = () => {
  const [notification] = useNotification();
  const { data: orders, loading } = useAxios("GET", `/order/userall/`);

  const cancelOrder = async (id) => {
    const { data } = await axios.put(`/order/${id}`, { status: "cancelled" });
    notification(data.message, "", "warning");
  };  

  return (
    <div>
      <h2>Orders</h2>
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
                  {e.delivery_date && (
                    <div>
                      <p>- - -</p>
                      <p>{deliveryPercent(e.delivery_date, e.created_at).state}</p>
                      <div className="delivery-container">
                        <div className="delivery-inner">
                          <div className='delivery-bar'
                            style={ correctStyle(e) }
                          >{e.flash_shipping ? <div className='ship-gradient delivery-pointer'></div> : <div><Gift className='delivery-pointer'/></div>}<div className='delivery-pointer-back'></div></div>
                        </div>
                        {
                          //! volver a ver: BORRAR ESTE PORCENTAJE
                        }
                        <p>
                          {deliveryPercent(e.delivery_date, e.created_at).percent + "%"}
                        </p>
                      </div>
                      <p>delivery ETA: {formatDate(e.delivery_date)}</p>
                    </div>
                  )}
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
