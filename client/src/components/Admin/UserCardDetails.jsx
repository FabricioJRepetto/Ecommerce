import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "../Products/Card";
import AddressCard from "../Profile/AddressCard";
import OrderCardAdmin from "./OrderCardAdmin";
import { adminLoadUserDetails } from "../../Redux/reducer/sessionSlice";

import "./UserCardDetails.css";
import OrderCard from "../Profile/OrderCard";
import WishlistCard from "../Profile/WishlistCard";

const UserCardDetails = ({ openBanUser, openUnbanUser, openPromoteUser }) => {
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [publications, setPublications] = useState([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const dispatch = useDispatch();
  const { adminUserDetails } = useSelector((state) => state.sessionReducer);

  const { userData, addressData, ordersData, wishlistData, publicationsData } =
    adminUserDetails;

  useEffect(() => {
    if (Object.keys(adminUserDetails).length) {
      setUser(userData);
      setAddresses(addressData);
      setOrders(ordersData);
      setWishlist(wishlistData);
      setPublications(publicationsData);
    }
  }, [adminUserDetails]);

  console.log(userData);

  useEffect(() => {
    return () => {
      dispatch(adminLoadUserDetails({}));
    };
  }, []);

  return (
    <div>
      UserCardDetails
      <div>
        <h2>{user.name}</h2>
        <h4>Email: {user.isGoogleUser ? user.googleEmail : user.email}</h4>
        {/* <h4>Cuenta de Google: {user.isGoogleUser ? "si" : "no"}</h4> */}
        <h4>Verificado: {user.emailVerified ? "si" : "no"}</h4>
        <h4>Rol: {user.role}</h4>
        {user.role === "client" && !user.isGoogleUser && (
          <button
            onClick={() => openPromoteUser({ _id: user._id, name: user.name })}
          >
            Promover a Administrador
          </button>
        )}
        {user.avatar ? (
          <img
            src={user.avatar}
            className="admin-usercard-img"
            referrerPolicy="no-referrer"
            alt={`${user.name}`}
          />
        ) : (
          <h4>Sin avatar</h4>
        )}
        {user.role === "client" && (
          <button
            onClick={() => openBanUser({ _id: user._id, name: user.name })}
          >
            Suspender
          </button>
        )}
        {user.role === "banned" && (
          <button
            onClick={() => openUnbanUser({ _id: user._id, name: user.name })}
          >
            Activar cuenta
          </button>
        )}
      </div>
      {addresses && addresses.length ? (
        <>
          <h1>Direcciones</h1>
          {React.Children.toArray(
            addresses.map((address) => <AddressCard address={address} />)
          )}
        </>
      ) : (
        <h1>Este usuario aún no agregó direcciones</h1>
      )}
      {orders && orders.length ? (
        <>
          <h1>Compras</h1>
          <div className="usercard-details-wishlist-container">
            {React.Children.toArray(
              orders.map((order) => (
                <div className="usercard-details-wishlist-card-container">
                  <OrderCard order={order} />
                </div>
              ))
            )}{" "}
          </div>
        </>
      ) : (
        <h1>Este usuario aún no efectuó compras</h1>
      )}
      {publications && publications.length ? (
        <>
          <h1>Publicaciones</h1>
          {/* {React.Children.toArray(
            publications.map((product) => <Card product={product} />)
          )} */}
        </>
      ) : (
        <h1>Este usuario aún no hizo publicaciones</h1>
      )}
      {wishlist && wishlist.length ? (
        <>
          <h1>Favoritos</h1>
          <div className="usercard-details-wishlist-container">
            {React.Children.toArray(
              wishlist.map((product) => (
                <div className="usercard-details-wishlist-card-container">
                  <WishlistCard productData={product} />
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <h1>Este usuario aún no agregó productos a favoritos</h1>
      )}
    </div>
  );
};

export default UserCardDetails;
