import { resizer } from "../../helpers/resizer";
import { useLocation, Link } from "react-router-dom";

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
    expiration_date_from,
    expiration_date_to,
    payment_date,
    free_shipping,
    shipping_cost,
    total,
  } = order;

  const formatDate = (d) => {
    if (typeof d === "string") {
      return d.toString().slice(0, -13).replace("T", " ");
    } else {
      return new Date(d).toISOString().slice(0, -8).replace("T", " ");
    }
  };

  return (
    <div className="profile-img-orders-container" key={id}>
      {products?.map((pic) => (
        <img key={pic.img} src={resizer(pic.img)} alt={"product"} />
      ))}
      <p>{description}</p>
      {location.pathname === "/admin/orders" && (
        <>
          <Link to={`/admin/users/${user}`}>
            <p>user: {user}</p>
          </Link>
        </>
      )}
      <p>
        shipping address:{" "}
        {`
                                ${shipping_address?.street_name} 
                                ${shipping_address?.street_number}, 
                                ${shipping_address?.city} 
                            `}
      </p>
      <p>Creado: {formatDate(expiration_date_from)}</p>
      <p>Estado: {status}</p>
      {status === "approved" && <p>Aprobado: {formatDate(payment_date)}</p>}
      {status === "pending" && (
        <p>Caducidad: {formatDate(expiration_date_to)}</p>
      )}
      {status === "expired" && (
        <p>Caducado: {formatDate(expiration_date_to)}</p>
      )}
      <p>Cost de envío: {free_shipping ? "Gratis" : shipping_cost}</p>
      <p>Total: ${total}</p>
      <p>- - -</p>
    </div>
  );
};

export default OrderCard;
