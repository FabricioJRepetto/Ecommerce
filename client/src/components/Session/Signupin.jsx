import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  sessionActive,
  loadUsername,
  loadEmail,
  loadAvatar,
} from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const { REACT_APP_OAUTH_CLIENT_ID } = process.env;

/* const initialSignup = {
  email: "",
  password: "",
  repPassword: "",
};
const initialSignin = {
  email: "",
  password: "",
}; */

const Signupin = () => {
  /*   const [signupData, setSignupData] = useState(initialSignup);
  const [signinData, setSigninData] = useState(initialSignin); */
  const [signSelect, setSignSelect] = useState("signin");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector((state) => state.sessionReducer.session);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm();

  const signup = (signupData) => {
    // e.preventDefault();
    console.log(signupData);
    axios.post(`/user/signup`, signupData).then((res) => console.log(res.data));
  };

  const signin = async (signinData) => {
    //  e.preventDefault();
    try {
      const { data } = await axios.post(`/user/signin`, signinData);

      if (data.user) {
        window.localStorage.setItem("loggedTokenEcommerce", data.token);
        console.log(data);
        dispatch(sessionActive(true));

        const username = data.user.name || data.user.email.split("@")[0];
        const email = data.user.email;
        const avatar = data.avatar || null;

        dispatch(loadUsername(username));
        dispatch(loadEmail(email));
        dispatch(loadAvatar(avatar));

        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*   const handleSignup = ({ target }) => {
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
  }; */

  const handleCallbackResponse = (response) => {
    //response.credential = Google user token
    const googleToken = "google" + response.credential;
    dispatch(sessionActive(true));
    window.localStorage.setItem("loggedTokenEcommerce", googleToken);

    //userDecoded contains Google user data
    const userDecoded = jwt_decode(response.credential);
    const username =
      userDecoded.name || userDecoded.email || `Guest ${userDecoded.sub}`;
    const avatar = userDecoded.picture;
    const email = userDecoded.email;

    dispatch(loadUsername(username));
    dispatch(loadAvatar(avatar));
    dispatch(loadEmail(email));

    window.localStorage.setItem("loggedAvatarEcommerce", avatar);
    window.localStorage.setItem("loggedEmailEcommerce", email);

    console.log(userDecoded);
    navigate("/profile");
  };

  useEffect(() => {
    if (session) navigate("/profile");

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

  const forgotPassword = (email) => {
    if (!email)
      return console.log("Please enter your email to reset your password");
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
            /* name="email"
          onChange={handleSignup}
          value={signupData.email} */
            {...register("email", {
              required: true,
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
            })}
          />
          {errors.email?.type === "required" && <p>Enter your email</p>}
          {errors.email?.type === "pattern" && <p>Enter a valid email</p>}

          <input
            type="text"
            placeholder="Password"
            /* name="password"
          onChange={handleSignup}
          value={signupData.password} */
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
            /* name="repPassword"
          onChange={handleSignup}
          value={signupData.repPassword} */
            {...register("repPassword", {
              required: true,
              validate: (repPassword) => {
                if (watch("password") !== repPassword) {
                  return "Passwords do not match";
                }
              },
            })}
          />
          {errors.repPassword?.type === "required" && (
            <p>Repeat your password</p>
          )}
          {errors.repPassword?.type === "validate" && (
            <p>Passwords do not match</p>
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
            /* name="email"
          onChange={handleSignin}
          value={signinData.email} */
            {...register("email", {
              required: true,
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
            })}
          />
          {errors.email?.type === "required" && <p>Enter your email</p>}
          {errors.email?.type === "pattern" && <p>Enter a valid email</p>}

          <input
            type="text"
            placeholder="Password"
            /* name="password"
          onChange={handleSignin}
          value={signinData.password} */
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
      <div id="signInDiv"></div>
      <hr />
    </>
  );
};

export default Signupin;
