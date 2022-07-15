import React from "react";
import { resizer } from "../../helpers/resizer";
import { useLocation } from "react-router-dom";

const OrderCard = ({ order }) => {
  //! VOLVER A VER agregar ordenamiento y filtros
  const location = useLocation();
  const {
    id,
    products,
    description,
    user,
    shipping_address,
    status,
    createdAt,
    free_shipping,
    shipping_cost,
    total,
  } = order;
  const formatDate = (date) => {
    let fecha = new Date(date.slice(0, -1));
    return fecha.toString().slice(0, 21);
  };

  return (
    <div className="profile-img-orders-container" key={id}>
      {products?.map((pic) => (
        <img key={pic.img} src={resizer(pic.img)} alt={"product"} />
      ))}
      <p>{description}</p>
      {location.pathname !== "/admin/users" && <p>user: {user.name}</p>}
      <p>
        shipping address:{" "}
        {`
                                ${shipping_address?.street_name} 
                                ${shipping_address?.street_number}, 
                                ${shipping_address?.city} 
                            `}
      </p>
      <p>date: {formatDate(createdAt)}</p>
      <p>payment status: {status}</p>
      <p>free shipping: {free_shipping ? "Yes" : "No"}</p>
      <p>shipping cost: {shipping_cost}</p>
      <p>total payment: ${total}</p>
      <p>- - -</p>
    </div>
  );
};

export default OrderCard;
