import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loadToken, loadUsername } from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";
import { BACK_URL } from "../../constants";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const token = useSelector((state) => state.sessionReducer.token);

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
    }).then(({ data }) => {
      window.localStorage.setItem("loggedTokenEcommerce", data.token);
      console.log(data);
      dispatch(loadToken(data.token));

      const username = data.user.name || data.user.email;
      dispatch(loadUsername(username));
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
    const username =
      userDecoded.name || userDecoded.email || `Guest ${userDecoded.sub}`;

    dispatch(loadUsername(username));

    console.log(userDecoded);
  };

  useEffect(() => {
    if (token) navigate("/signout");

    /* global google */
    google.accounts.id.initialize({
      client_id: REACT_APP_OAUTH_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
    // eslint-disable-next-line
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
