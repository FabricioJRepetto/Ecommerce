import React, { useState, useEffect } from "react";
import Axios from "axios";
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
  // eslint-disable-next-line
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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
    //response.credential = google user token
    const googleToken = "google" + response.credential;
    dispatch(loadToken(googleToken));
    const userDecoded = jwt_decode(response.credential);
    setUser(userDecoded);
    document.getElementById("signInDiv").hidden = true;
  };

  let userGoogle1 = {
    aud: "1092031009479-73reo300d0ja70b214b1n2v09grv3c26.apps.googleusercontent.com",
    azp: "1092031009479-73reo300d0ja70b214b1n2v09grv3c26.apps.googleusercontent.com",
    email: "el.ninio@live.com.ar",
    email_verified: true,
    exp: 1654027598,
    given_name: "cumpaMirá",
    iat: 1654023998,
    iss: "https://accounts.google.com",
    jti: "bc750c1451f8ebb6b60f6b8b995813c25f555446",
    name: "cumpaMirá",
    nbf: 1654023698,
    picture:
      "https://lh3.googleusercontent.com/a-/AOh14GjIlq1XqXtccF0LK7YDAeSf4IziyWMc1uv0h4rb3A=s96-c",
    sub: "109754491233849488161",
  };

  let userGoogle2 = {
    aud: "1092031009479-73reo300d0ja70b214b1n2v09grv3c26.apps.googleusercontent.com",
    azp: "1092031009479-73reo300d0ja70b214b1n2v09grv3c26.apps.googleusercontent.com",
    email: "fer.eze.ram@gmail.com",
    email_verified: true,
    exp: 1654027810,
    family_name: "Ramirez",
    given_name: "Fernando",
    iat: 1654024210,
    iss: "https://accounts.google.com",
    jti: "02004a8bb43310b54f95a8bfedd4e259b7e9d789",
    name: "Fernando Ramirez",
    nbf: 1654023910,
    picture:
      "https://lh3.googleusercontent.com/a/AATXAJxOQzh6iezBeW7wD4PAhlTlB-lfVu07iEh-p7XJ=s96-c",
    sub: "103519818468996423776",
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
