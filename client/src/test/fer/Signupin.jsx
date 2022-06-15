import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { sessionActive, loadUsername } from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const { REACT_APP_OAUTH_CLIENT_ID } = process.env;
const initialSignup = {
  email: "fer.eze.ram@gmail.com",
  password: "fer.eze.ram@gmail.com",
  repPassword: "fer.eze.ram@gmail.com",
};
const initialSignin = {
  email: "fer.eze.ram@gmail.com",
  password: "fer.eze.ram@gmail.com",
};

const Signupin = () => {
  const [signupData, setSignupData] = useState(initialSignup);
  const [signinData, setSigninData] = useState(initialSignin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector((state) => state.sessionReducer.session);

  const signup = (e) => {
    e.preventDefault();
    axios.post(`/user/signup`, signupData).then((res) => console.log(res.data));
  };

  const signin = (e) => {
    e.preventDefault();
    axios
      .post(`/user/signin`, signinData)
      .then(({ data }) => {
        if (data.user) {
          window.localStorage.setItem("loggedTokenEcommerce", data.token);
          console.log(data);
          dispatch(sessionActive(true));

          const username = data.user.name || data.user.email;
          dispatch(loadUsername(username));
          navigate("/signout");
        } else {
          console.log(data);
        }
      })
      .catch((err) => console.log(err));
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
    dispatch(sessionActive(true));
    window.localStorage.setItem("loggedTokenEcommerce", googleToken);

    //userDecoded contains Google user data
    const userDecoded = jwt_decode(response.credential);
    const username =
      userDecoded.name || userDecoded.email || `Guest ${userDecoded.sub}`;

    dispatch(loadUsername(username));

    console.log(userDecoded);
    navigate("/signout");
  };

  useEffect(() => {
    if (session) navigate("/signout");

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
  }, [session]);

  const forgotPassword = () => {
    if (!signinData.email) return console.log("Please enter an email");
    axios
      .put("/user/forgotPassword", signinData)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

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
        <input
          type="text"
          name="repPassword"
          placeholder="Repeat Password"
          onChange={handleSignup}
          value={signupData.repPassword}
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
        <span onClick={forgotPassword}>Forgot password?</span>
        <input type="submit" value="Sign In" />
      </form>
      <hr />
      <div id="signInDiv"></div>
    </>
  );
};

export default Signupin;
