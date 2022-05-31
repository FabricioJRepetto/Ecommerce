import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadToken } from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";

const { REACT_APP_OAUTH_CLIENT_ID } = process.env;
const initialSignup = {
  email: "",
  password: "",
};
const initialSignin = {
  email: "test",
  password: "test",
};

const Signupin = () => {
  const [signupData, setSignupData] = useState(initialSignup);
  const [signinData, setSigninData] = useState(initialSignin);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  const signup = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: signupData,
      withCredentials: true,
      url: "http://localhost:4000/user/signup", //! VOLVER A VER cambiar
    }).then((res) => console.log(res.data));
  };
  const signin = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: signinData,
      withCredentials: true,
      url: "http://localhost:4000/user/signin", //! VOLVER A VER cambiar
    }).then((res) => {
      window.localStorage.setItem("loggedTokenEcommerce", res.data.token);
      console.log(res.data);
      dispatch(loadToken(res.data.token));
    });
  };

  const handleSignup = ({ target }) => {
    setSignupData({
      ...signupData,
      [target.name]: target.value,
    });
  };
  const handleSignin = ({ target }) => {
    setSigninData({
      ...signinData,
      [target.name]: target.value,
    });
  };

  const handleCallbackResponse = (response) => {
    console.log("shii forkii", response.credential);
    const userDecoded = jwt_decode(response.credential);
    setUser(userDecoded);
    document.getElementById("signInDiv").hidden = true;
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: REACT_APP_OAUTH_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <>
      <hr />
      <form onSubmit={signup}>
        <h2>Sign Up</h2>
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={handleSignup}
          value={signupData.email}
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleSignup}
          value={signupData.password}
        />
        <input type="submit" value="Sign Up" />
      </form>
      <hr />
      <form onSubmit={signin}>
        <h2>Sign In</h2>
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={handleSignin}
          value={signinData.email}
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleSignin}
          value={signinData.password}
        />
        <input type="submit" value="Sign In" />
      </form>
      <hr />
      <div id="signInDiv"></div>
      <hr />
      <div>
        <Link to="/signout">
          <h3>Sign out</h3>
        </Link>
        <Link to="/products">
          <h3>Products</h3>
        </Link>
        <Link to="/productForm">
          <h3>Create Products</h3>
        </Link>
        <Link to="/cart">
          <h3>Cart</h3>
        </Link>
      </div>
    </>
  );
};

export default Signupin;
