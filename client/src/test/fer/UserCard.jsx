import axios from "axios";
import { useState } from "react";

const UserCard = ({ user, openDeleteUser, openPromoteUser }) => {
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const { name, email, role, emailVerified, avatar, _id } = user;

  const getAddresses = (_id) => {
    axios("/user/getAddressesAdmin").then(({ data }) => {
      console.log(data);
      setAddresses(data);
      setShowAddresses(true);
    });
  };

  const getOrders = (_id) => {
    axios("/user/getOrdersAdmin").then(({ data }) => {
      console.log(data);
      setOrders(data);
      setShowOrders(true);
    });
  };

  return (
    <div>
      <div>
        <h2>{name}</h2>
        <h4>Email: {email}</h4>
        <h4>Rol: {role}</h4>
        {role === "client" && (
          <button onClick={() => openPromoteUser({ _id, name })}>
            Promover a Administrador
          </button>
        )}
        <h4>Verificado: {emailVerified ? "si" : "no"}</h4>
        <img src={avatar} alt={`${name}`} />
        {role === "client" && (
          <button onClick={() => openDeleteUser({ _id, name })}>
            Eliminar
          </button>
        )}
        {showAddresses ? (
          <h4>Direcciones</h4>
        ) : (
          <button onClick={() => getAddresses(_id)}>Obtener Direcciones</button>
        )}
        {showOrders ? (
          <h4>Órdenes</h4>
        ) : (
          <button onClick={() => getOrders(_id)}>Obtener Órdenes</button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default UserCard;
