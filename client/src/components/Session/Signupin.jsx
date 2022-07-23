import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { sessionActive } from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNotification } from "../../hooks/useNotification";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import "./Signupin.css";
const { REACT_APP_OAUTH_CLIENT_ID } = process.env;

const Signupin = () => {
  const [signSelect, setSignSelect] = useState("signin");
  const [flag, setFlag] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.sessionReducer);

  const {
    register: registerSignin,
    handleSubmit: handleSubmitSignin,
    formState: { errors: errorsSignin },
  } = useForm();

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
    watch: watchSignup,
  } = useForm();

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
  } = useForm();

  const location = useLocation();
  const hasPreviousState = location.key !== "default";
  const [notification] = useNotification();
  const [isOpenForgotPassword, openForgotPassword, closeForgotPassword] =
    useModal();

  const emailRegex = /^[\w-.]+@([\w-])+[.\w-]*$/i;

  //? CREACION DE CUENTA
  const signup = (signupData) => {
    axios.post(`/user/signup`, signupData).then((res) => console.log(res.data));
    //! VOLVER A VER agregar notif de email
    //! VOLVER A VER manejo de errores
  };

//? LOGIN CON MAIL
  const signin = async (signinData) => {
    try {
      const { data } = await axios.post(`/user/signin`, signinData);

      if (data.user) {
        window.localStorage.setItem("loggedTokenEcommerce", data.token);
        dispatch(sessionActive(true));

        const username = data.user.name || data.user.email.split("@")[0];
        notification(`Bienvenido, ${username}`, "", "success");
      }
    } catch (error) {
      notification(error.response.data.message, "", "error");
      //! VOLVER A VER manejo de errores
    }
  };

//? LOGIN CON GOOGLE
  const handleCallbackResponse = async (response) => {
    //:console.log('!! sign in');
    //:console.log(window.localStorage.getItem("loggedTokenEcommerce"));

    //response.credential = Google user token
    const googleToken = "google" + response.credential;
    window.localStorage.setItem("loggedTokenEcommerce", googleToken);

    //userDecoded contains Google user data
    const userDecoded = jwt_decode(response.credential);
    const {
      sub,
      googleEmail: email,
      email_verified: emailVerified,
      picture: avatar,
      given_name: firstName,
      family_name: lastName,
    } = userDecoded;
    console.log(userDecoded);

    try {
      const { data } = await axios.post(`/user/signinGoogle`, {
        sub,
        email,
        emailVerified,
        avatar,
        firstName,
        lastName,
      });

      notification(`Bienvenido, ${data.name}`, "", "success");
      dispatch(sessionActive(true));
    } catch (error) {
      console.log(error); //! VOLVER A VER manejo de errores
    }
  };

  useEffect(() => {
    //! VOLVER A VER si sigue sin funcionar bien: utilizar location.pathname
    if (session) {
      if (hasPreviousState) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
    setFlag(true) // solo se usa para la animacion fade-in

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

  const forgotPassword = (email) => {
    console.log(email);
    axios
      .put("/user/forgotPassword", email)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  };

  const handleSign = (sign) => {
        setSignSelect(sign);
  };

  return (
    <div className="signin-container">
        <div className={`signin-inner ${flag && 'signin-visible'}`}>
            <img src={require('../../assets/provider-logo.png')} alt="logo" 
                onClick={() => navigate('/')} style={{ cursor: 'pointer'}}/>
            <div>
                <span onClick={() => handleSign("signup")}>SIGN UP</span>
            </div>
            <div>
                <span onClick={() => handleSign("signin")}>SIGN IN</span>
            </div>

            {signSelect === "signup" && (
                <form onSubmit={handleSubmitSignup(signup)}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    placeholder="email"
                    autoComplete="off"
                    {...registerSignup("email", {
                    required: true,
                    pattern: emailRegex,
                    })}
                />
                {errorsSignup.email?.type === "required" && <p>Enter your email</p>}
                {errorsSignup.email?.type === "pattern" && <p>Enter a valid email</p>}

                <input
                    type="text"
                    placeholder="Password"
                    autoComplete="off"
                    {...registerSignup("password", {
                    required: true,
                    minLength: 6,
                    })}
                />
                {errorsSignup.password?.type === "required" && (
                    <p>Enter a password</p>
                )}
                {errorsSignup.password?.type === "minLength" && (
                    <p>Password must be 6 characters long at least</p>
                )}

                <input
                    type="text"
                    placeholder="Repeat Password"
                    autoComplete="off"
                    {...registerSignup("repPassword", {
                    required: true,
                    validate: (repPassword) => {
                        if (watchSignup("password") !== repPassword) {
                        return "Passwords don't match";
                        }
                    },
                    })}
                />
                {errorsSignup.repPassword?.type === "required" && (
                    <p>Repeat your password</p>
                )}
                {errorsSignup.repPassword?.type === "validate" && (
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
                <form onSubmit={handleSubmitSignin(signin)}>
                <h2>Sign In</h2>
                <input
                    type="text"
                    placeholder="email"
                    autoComplete="off"
                    {...registerSignin("email", {
                    required: true,
                    pattern: emailRegex,
                    })}
                />
                {errorsSignin.email?.type === "required" && <p>Enter your email</p>}
                {errorsSignin.email?.type === "pattern" && <p>Enter a valid email</p>}

                <input
                    type="text"
                    placeholder="Password"
                    autoComplete="off"
                    {...registerSignin("password", {
                    required: true,
                    })}
                />
                {errorsSignin.password?.type === "required" && (
                    <p>Enter your password</p>
                )}
                <input type="submit" value="Sign In" />
                <br />
                <span onClick={openForgotPassword}>Forgot password?</span>
                <div>
                    <span onClick={() => handleSign("signup")}>
                    You don't have an account? SIGN UP
                    </span>
                </div>
                </form>
            )}
        
            <div className="google-signin-container" id="signInDiv"></div>

            <NavLink to={'/'}>{'< volver'}</NavLink>
      </div>
      
      <Modal isOpen={isOpenForgotPassword} closeModal={closeForgotPassword}>
        <form onSubmit={handleSubmitForgot(forgotPassword)}>
          <h2>Ingrese su email para reestablecer la contraseña</h2>
          <input
            type="text"
            placeholder="email"
            autoComplete="off"
            {...registerForgot("email", {
              required: true,
              pattern: emailRegex,
            })}
          />
          {errorsForgot.emailForgot?.type === "required" && (
            <p>Ingresa tu email</p>
          )}
          {errorsForgot.emailForgot?.type === "pattern" && (
            <p>Ingresa un email válido</p>
          )}
          <input type="submit" value="Enviar email" />
        </form>
      </Modal>
    </div>
  );
};

export default Signupin;
