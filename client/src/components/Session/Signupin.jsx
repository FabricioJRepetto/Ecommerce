import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  sessionActive,
  loadUsername,
  loadEmail,
  loadAvatar,
  loadRole,
} from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loadCart, loadWhishlist } from "../../Redux/reducer/cartSlice";
import "./Signupin.css";
import { useRef } from "react";
import { useNotification } from "../../hooks/useNotification";

const { REACT_APP_OAUTH_CLIENT_ID } = process.env;

const Signupin = () => {
  const [signSelect, setSignSelect] = useState("signin");
  const [warn, setWarn] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.sessionReducer);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm();
  let timeoutId = useRef();
  const [notification] = useNotification();
  const location = useLocation();
  const hasPreviousState = location.key !== "default";

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

  const signup = (signupData) => {
    console.log(signupData);
    axios.post(`/user/signup`, signupData).then((res) => console.log(res.data));
    //! VOLVER A VER agregar notif de email
  };

  const signin = async (signinData) => {
    try {
      const { data } = await axios.post(`/user/signin`, signinData);
      console.log(data);

      if (data.user) {
        window.localStorage.setItem("loggedTokenEcommerce", data.token);
        dispatch(sessionActive(true));

        const username = data.user.name || data.user.email.split("@")[0];
        const { email, role, avatar } = data.user;
        // const avatar = data.avatar || null;
        const whish = await axios(`/whishlist`);
        const cart = await axios(`/cart`);

        dispatch(loadUsername(username));
        dispatch(loadEmail(email));
        if (avatar) dispatch(loadAvatar(avatar));
        dispatch(loadRole(role));
        dispatch(loadCart(cart.data.id_list));
        dispatch(loadWhishlist(whish.data.id_list));

        notification(`Bienvenido, ${username}`, "", "success");
        navigate("/");
        //navigate(-1) // ?!
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCallbackResponse = async (response) => {
    //response.credential = Google user token
    const googleToken = "google" + response.credential;
    dispatch(sessionActive(true));
    window.localStorage.setItem("loggedTokenEcommerce", googleToken);

    //userDecoded contains Google user data
    const userDecoded = jwt_decode(response.credential);
    const username =
      userDecoded.name || userDecoded.email || `Guest ${userDecoded.sub}`;

    //: (https://lh3.googleusercontent.com/a-/AOh14GilAqwqC7Na70IrMsk0bJ8XGwz8HLFjlurl830D5g=s96-c).split('=')[0]
    const avatar = userDecoded.picture;
    const email = userDecoded.email;

    const whish = await axios(`/whishlist`);
    const cart = await axios(`/cart`);

    dispatch(loadUsername(username));
    dispatch(loadAvatar(avatar));
    dispatch(loadEmail(email));
    dispatch(loadRole("client"));
    dispatch(loadCart(cart.data.id_list));
    dispatch(loadWhishlist(whish.data.id_list));

    window.localStorage.setItem("loggedAvatarEcommerce", avatar);
    window.localStorage.setItem("loggedEmailEcommerce", email);

    navigate("/");
    console.log(userDecoded);
    //navigate(-1)  // ?!
  };

  useEffect(() => {
    if (session) {
      if (hasPreviousState) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }

    /* global google */
    google.accounts.id.initialize({
      client_id: REACT_APP_OAUTH_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      width: 240,
      theme: "light",
    });
    // eslint-disable-next-line
  }, [session]);

  const warnTimer = (message) => {
    clearTimeout(timeoutId.current);
    setWarn(message);
    let timeout = () => setTimeout(() => setWarn(), 5000);
    timeoutId.current = timeout();
  };

  const forgotPassword = (email) => {
    if (!email)
      return warnTimer("Por favor ingresa tu email para recuperar tu password"); //! VOLVER A VER agregar color a input de email al haber warn
    if (!email.match(emailRegex)) {
      //if (!emailRegex.test(email))
      return warnTimer(
        "Por favor ingresa un email válido para recuperar tu password"
      );
    }
    axios
      .put("/user/forgotPassword", email)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const handleSign = (sign) => {
    setSignSelect(sign);
  };

  return (
    <>
      <hr />
      <div>
        <span onClick={() => handleSign("signup")}>SIGN UP</span>
      </div>
      <div>
        <span onClick={() => handleSign("signin")}>SIGN IN</span>
      </div>

      {signSelect === "signup" && (
        <form onSubmit={handleSubmit(signup)}>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="email"
            {...register("email", {
              required: true,
              pattern: emailRegex,
            })}
          />
          {errors.email?.type === "required" && <p>Enter your email</p>}
          {errors.email?.type === "pattern" && <p>Enter a valid email</p>}

          <input
            type="text"
            placeholder="Password"
            {...register("password", {
              required: true,
              minLength: 6,
            })}
          />
          {errors.password?.type === "required" && <p>Enter a password</p>}
          {errors.password?.type === "minLength" && (
            <p>Password must be 6 characters long at least</p>
          )}

          <input
            type="text"
            placeholder="Repeat Password"
            {...register("repPassword", {
              required: true,
              validate: (repPassword) => {
                if (watch("password") !== repPassword) {
                  return "Passwords don't match";
                }
              },
            })}
          />
          {errors.repPassword?.type === "required" && (
            <p>Repeat your password</p>
          )}
          {errors.repPassword?.type === "validate" && (
            <p>Passwords don't match</p>
          )}

          <input type="submit" value="Sign Up" />
          <div>
            <span onClick={() => handleSign("signin")}>
              You already have an account? SIGN IN
            </span>
          </div>
        </form>
      )}

      {signSelect === "signin" && (
        <form onSubmit={handleSubmit(signin)}>
          <h2>Sign In</h2>
          <input
            type="text"
            placeholder="email"
            {...register("email", {
              required: true,
              pattern: emailRegex,
            })}
          />
          {errors.email?.type === "required" && <p>Enter your email</p>}
          {errors.email?.type === "pattern" && <p>Enter a valid email</p>}
          {warn && <p>{warn}</p>}

          <input
            type="text"
            placeholder="Password"
            {...register("password", {
              required: true,
            })}
          />
          {errors.password?.type === "required" && <p>Enter your password</p>}
          <input type="submit" value="Sign In" />
          <br />
          <span onClick={() => forgotPassword(getValues("email"))}>
            Forgot password?
          </span>
          <div>
            <span onClick={() => handleSign("signup")}>
              You don't have an account? SIGN UP
            </span>
          </div>
        </form>
      )}
      <hr />
      <div className="google-signin-container" id="signInDiv"></div>
      <hr />
      <button onClick={() => navigate(-1)}> go back</button>
    </>
  );
};

export default Signupin;
