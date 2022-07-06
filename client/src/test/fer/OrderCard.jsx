import React from "react";
import { resizer } from "../../helpers/resizer";

const OrderCard = ({ order }) => {
  const formatDate = (date) => {
    let fecha = new Date(date.slice(0, -1));
    return fecha.toString().slice(0, 21);
  };

  return (
    <div className="profile-img-orders-container" key={order.id}>
      {order.products?.map((pic) => (
        <img key={pic.img} src={resizer(pic.img)} alt={"product"} />
      ))}
      <p>{order.description}</p>
      <p>user: {order.user.name}</p>
      <p>
        shipping address:{" "}
        {`
                                ${order.shipping_address?.street_name} 
                                ${order.shipping_address?.street_number}, 
                                ${order.shipping_address?.city} 
                            `}
      </p>
      <p>date: {formatDate(order.createdAt)}</p>
      <p>payment status: {order.status}</p>
      <p>free shipping: {order.free_shipping ? "Yes" : "No"}</p>
      <p>shipping cost: {order.shipping_cost}</p>
      <p>total payment: ${order.total}</p>
      <p>- - -</p>
    </div>
  );
};

export default OrderCard;
