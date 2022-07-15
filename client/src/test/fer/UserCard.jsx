import axios from "axios";
import React, { useState } from "react";
import AddressCard from "./AddressCard";
import OrderCard from "./OrderCard";

const UserCard = ({ user, openDeleteUser, openPromoteUser }) => {
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const {
    name,
    email,
    role,
    emailVerified,
    avatar,
    _id,
    isGoogleUser,
    googleEmail,
  } = user;

  const getAddresses = (_id) => {
    console.log(_id);
    axios
      .post("/user/getAddressesAdmin", { _id, isGoogleUser })
      .then(({ data }) => {
        setAddresses(data);
        setShowAddresses(true);
      });
  };

  const getOrders = (_id) => {
    console.log(_id);
    axios
      .post("/user/getOrdersAdmin", { _id, isGoogleUser })
      .then(({ data }) => {
        setOrders(data);
        setShowOrders(true);
      });
  };

  const getWishlist = (_id) => {
    console.log(_id);
    axios
      .post("/user/getWishlistAdmin", { _id, isGoogleUser })
      .then(({ data }) => {
        setWishlist(data);
        setShowWishlist(true);
      });
  };

  return (
    <div>
      <div>
        <h2>{name}</h2>
        <h4>Email: {isGoogleUser ? googleEmail : email}</h4>
        <h4>Cuenta de Google: {isGoogleUser ? "si" : "no"}</h4>
        <h4>Verificado: {emailVerified ? "si" : "no"}</h4>
        <h4>Rol: {role}</h4>
        {role === "client" && (
          <button onClick={() => openPromoteUser({ _id, name })}>
            Promover a Administrador
          </button>
        )}
        <img src={avatar} alt={`${name}`} />
        {role === "client" && (
          <button onClick={() => openDeleteUser({ _id, name })}>
            Eliminar
          </button>
        )}
        {showAddresses ? (
          !addresses.length ? (
            <h4>No se encontraron direcciones</h4>
          ) : (
            <>
              <h4>Direcciones</h4>
              {React.Children.toArray(
                addresses.map((address) => <AddressCard address={address} />)
              )}
            </>
          )
        ) : (
          <button onClick={() => getAddresses(_id)}>Obtener Direcciones</button>
        )}
        {showOrders ? (
          !orders.length ? (
            <h4> No se encontraron órdenes</h4>
          ) : (
            <>
              <h4>Órdenes</h4>
              {React.Children.toArray(
                orders.map((order) => <OrderCard order={order} />)
              )}
            </>
          )
        ) : (
          <button onClick={() => getOrders(_id)}>Obtener Órdenes</button>
        )}
        {showWishlist ? (
          !wishlist.length ? (
            <h4> No se encontraron órdenes</h4>
          ) : (
            <>
              <h4>Lista de Deseados</h4>
              {React.Children.toArray(
                orders.map((order) => <OrderCard order={order} />)
              )}
            </>
          )
        ) : (
          <button onClick={() => getWishlist(_id)}>
            Obtener Lista de Deseados
          </button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default UserCard;
