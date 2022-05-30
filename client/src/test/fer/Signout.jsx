import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loadToken } from "../../Redux/reducer/sessionSlice";

const Signout = () => {
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.sessionReducer.token);
  const dispatch = useDispatch();

  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/user/profile", //! VOLVER A VER cambiar
      headers: {
        Authorization: `token ${token}`,
      },
    }).then((res) => {
      setUserData(res.data.user);
      console.log(res.data);
    });
  };

  const signOut = () => {
    window.localStorage.removeItem("loggedTokenEcommerce");
    dispatch(loadToken(""));
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
