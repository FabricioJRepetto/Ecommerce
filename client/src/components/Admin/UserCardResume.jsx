import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "../Products/Card";
import AddressCard from "../Profile/AddressCard";
import OrderCardAdmin from "./OrderCardAdmin";
import "./UserCardResume.css";

const UserCardResume = ({
  user,
  openBanUser,
  openUnbanUser,
  openPromoteUser,
}) => {
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

  /*   const getAddresses = (_id) => {
    axios
      .post("/admin/user/getAddresses", { _id, isGoogleUser })
      .then(({ data }) => {
        setAddresses(data);
        setShowAddresses(true);
      })
      .catch((err) => console.error(err)); //! VOLVER A VER manejo de errores;
  };

  const getOrders = (_id) => {
    axios
      .post("/admin/user/getOrders", { _id, isGoogleUser })
      .then(({ data }) => {
        setOrders(data);
        setShowOrders(true);
      })
      .catch((err) => console.error(err)); //! VOLVER A VER manejo de errores;
  };

  const getWishlist = (_id) => {
    axios
      .post("/admin/user/getWishlist", { _id, isGoogleUser })
      .then(({ data }) => {
        setWishlist(data);
        setShowWishlist(true);
      })
      .catch((err) => console.error(err)); //! VOLVER A VER manejo de errores;
  }; */

  return (
    <div className="usercard-resume-container component-fadeIn">
      <div className="usercard-main-data-container">
        {avatar ? (
          <img
            src={avatar}
            className="admin-usercard-img"
            referrerPolicy="no-referrer"
            alt={`${name}`}
          />
        ) : (
          <div className="usercard-no-avatar-placeholder">NO AVATAR</div>
        )}

        <div className="usercard-text-data-container">
          <h3>{name}</h3>
          <h4>Email: {isGoogleUser ? googleEmail : email}</h4>
          <h4>Cuenta de Google: {isGoogleUser ? "si" : "no"}</h4>
          <h4>Verificado: {emailVerified ? "si" : "no"}</h4>
          <h4>Rol: {role}</h4>
        </div>
      </div>
      {role === "client" && !isGoogleUser && (
        <button
          onClick={() => openPromoteUser({ _id, name })}
          className="g-white-button"
        >
          Promover a Administrador
        </button>
      )}
      {role === "client" && (
        <button
          onClick={() => openBanUser({ _id, name })}
          className="g-white-button"
        >
          Suspender
        </button>
      )}
      {role === "banned" && (
        <button
          onClick={() => openUnbanUser({ _id, name })}
          className="g-white-button"
        >
          Activar cuenta
        </button>
      )}
      <Link to={`/admin/users/${_id}`}>
        <button className="g-white-button">Ver detalles</button>
      </Link>
    </div>
  );
};

export default UserCardResume;
