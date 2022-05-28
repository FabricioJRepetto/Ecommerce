import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Signout = () => {
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.productsReducer.token);

  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/user/profile", //! VOLVER A VER cambiar
    }).then((res) => {
      setUserData(res.data.user);
      console.log(res.data);
    });
  };

  const signOut = () => {
    /* axios
      .get("http://localhost:4000/user/signout") */
    Axios({
      method: "DELETE",
      url: "http://localhost:4000/user/signout",
    }).then((res) => console.log("sesion cerrada"));
  };

  return (
    <>
      <hr />
      <h2>USER</h2>
      {userData && <h1>{userData.email}</h1>}
      <button onClick={getUser}>Get User</button>
      <button onClick={signOut}>Sign Out</button>
      <hr />
      <div>
        <Link to="/signin">
          <h3>Sign in</h3>
        </Link>
        <Link to="/products">
          <h3>Products</h3>
        </Link>
        <Link to="/cart">
          <h3>Cart</h3>
        </Link>
      </div>
    </>
  );
};

export default Signout;
