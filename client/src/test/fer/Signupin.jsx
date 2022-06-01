import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { loadToken } from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";
import { BACK_URL } from "./constants";

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

  const signup = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: signupData,
      withCredentials: true,
      url: `${BACK_URL}/user/signup`, //! VOLVER A VER cambiar
    }).then((res) => console.log(res.data));
  };
  const signin = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: signinData,
      withCredentials: true,
      url: `${BACK_URL}/user/signin`, //! VOLVER A VER cambiar
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
    //response.credential = Google user token
    const googleToken = "google" + response.credential;
    dispatch(loadToken(googleToken));
    //userDecoded contains Google user data
    const userDecoded = jwt_decode(response.credential);

    document.getElementById("signInDiv").hidden = true;
    console.log(userDecoded);
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
    </>
  );
};

export default Signupin;
