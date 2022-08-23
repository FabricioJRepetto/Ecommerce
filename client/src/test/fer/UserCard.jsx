import axios from "axios";
import React, { useState } from "react";
import Card from "../../components/Products/Card";
import AddressCard from "./AddressCard";
import OrderCard from "./OrderCard";

const UserCard = ({ user, openBanUser, openUnbanUser, openPromoteUser }) => {
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
    axios
      .post("/admin/user/getAddresses", { _id, isGoogleUser })
      .then(({ data }) => {
        setAddresses(data);
        setShowAddresses(true);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores;
  };

  const getOrders = (_id) => {
    axios
      .post("/admin/user/getOrders", { _id, isGoogleUser })
      .then(({ data }) => {
        setOrders(data);
        setShowOrders(true);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores;
  };

  const getWishlist = (_id) => {
    axios
      .post("/admin/user/getWishlist", { _id, isGoogleUser })
      .then(({ data }) => {
        console.log(data);
        setWishlist(data);
        setShowWishlist(true);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores;
  };

  return (
    <div>
      <div>
        <h2>{name}</h2>
        <h4>Email: {isGoogleUser ? googleEmail : email}</h4>
        <h4>Cuenta de Google: {isGoogleUser ? "si" : "no"}</h4>
        <h4>Verificado: {emailVerified ? "si" : "no"}</h4>
        <h4>Rol: {role}</h4>
        {role === "client" && !isGoogleUser && (
          <button onClick={() => openPromoteUser({ _id, name })}>
            Promover a Administrador
          </button>
        )}
        {avatar ? (
          <img src={avatar} referrerPolicy="no-referrer" alt={`${name}`} />
        ) : (
          <h4>Sin avatar</h4>
        )}
        {role === "client" && (
          <button onClick={() => openBanUser({ _id, name })}>Suspender</button>
        )}
        {role === "banned" && (
          <button onClick={() => openUnbanUser({ _id, name })}>
            Activar cuenta
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
            <h4> No se encontró Lista de Deseados</h4>
          ) : (
            <>
              <h4>Lista de Deseados</h4>
              {React.Children.toArray(
                wishlist.map((product) => <Card productData={product} />)
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
