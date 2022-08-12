import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  sessionActive,
  loadingUserData,
} from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNotification } from "../../hooks/useNotification";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import {
  CloseIcon,
  ArrowBackIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import LoaderBars from "../common/LoaderBars";
import "./Signupin.css";
import "../../App.css";
const { REACT_APP_OAUTH_CLIENT_ID } = process.env;

const Signupin = () => {
  const [signSelect, setSignSelect] = useState("signin");
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.sessionReducer);
  const [response, setResponse] = useState(null);
  const [viewPassword, setViewPassword] = useState({
    signin: false,
    signup: false,
    signupRepeat: false,
  });

  const {
    register: registerSignin,
    handleSubmit: handleSubmitSignin,
    formState: { errors: errorsSignin },
    setValue: setValueSignin,
    watch: watchSignin,
  } = useForm();

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
    setValue: setValueSignup,
    watch: watchSignup,
  } = useForm();

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
    setValue: setValueForgot,
    watch: watchForgot,
  } = useForm();

  const location = useLocation();
  const hasPreviousState = location.key !== "default";
  const [notification] = useNotification();
  const [isOpenForgotPassword, openForgotPassword, closeForgotPassword] =
    useModal();
  const [isOpenLoader, openLoader, closeLoader] = useModal();

  const emailRegex = /^[\w-.]+@([\w-])+[.\w-]*$/i;

  //? CREACION DE CUENTA
  const signup = async (signupData) => {
    openLoader();
    try {
      const { data } = await axios.post(`/user/signup`, signupData);
      data.error && notification(data.message, "", "warning");
    } catch (error) {
      console.log(error);
      //! VOLVER A VER manejo de errores
    } finally {
      closeLoader();
    }
  };

  //? LOGIN CON MAIL
  const signin = async (signinData) => {
    dispatch(loadingUserData(true));
    try {
      const { data } = await axios.post(`/user/signin`, signinData);

      if (data.user) {
        window.localStorage.setItem("loggedTokenEcommerce", data.token);
        dispatch(sessionActive(true));

        notification(`Bienvenido, ${data.user.name}`, "", "success");
      }
    } catch (error) {
      //! VOLVER A VER manejo de errores
      notification(error.response.data.message, "", "error");
      dispatch(loadingUserData(false));
    }
  };

  //? LOGIN CON GOOGLE
  const handleCallbackResponse = async (response) => {
    dispatch(loadingUserData(true));
    //response.credential = Google user token
    const googleToken = "google" + response.credential;
    window.localStorage.setItem("loggedTokenEcommerce", googleToken);

    //userDecoded contains Google user data
    const userDecoded = jwt_decode(response.credential);
    const {
      sub,
      email,
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
      dispatch(loadingUserData(false));
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
    setFlag(true); // solo se usa para la animacion fade-in

    /* global google */
    google.accounts.id.initialize({
      client_id: REACT_APP_OAUTH_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      type: "standard",
      size: "large",
      width: 240,
      text: "continue_with",
    });
    // eslint-disable-next-line
  }, [session]);

//   useEffect(() => {
//     // session && navigate("/");
//     setValueSignin("email", "fer.eze.ram@gmail.com");
//     setValueSignin("password", "fer.eze.ram@gmail.com");
//     setValueSignup("email", "fer.eze.ram@gmail.com");
//     setValueSignup("password", "fer.eze.ram@gmail.com");
//     setValueSignup("repPassword", "fer.eze.ram@gmail.com");
//     setValueForgot("email", "fer.eze.ram@gmail.com");
//     // eslint-disable-next-line
//   }, []);

  const forgotPassword = async (email) => {
    openLoader();
    try {
      const { data } = await axios.put("/user/forgotPassword", email);
      setResponse(data.message);
    } catch (error) {
      console.log(error);
    } finally {
      closeLoader();
    } //! VOLVER A VER manejo de errores
  };

  const handleSign = (sign) => {
    setSignSelect(sign);
  };

  return (
    <div className="signin-container">
      <div className={`signin-inner ${flag && "signin-visible"}`}>
        <img
          src={require("../../assets/provider-logo.png")}
          alt="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        {signSelect === "signin" && (
          <form onSubmit={handleSubmitSignin(signin)}>
            <>
              {!errorsSignin.email && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsSignin.email?.type === "required" && (
                <p className="g-error-input">Ingresa tu email</p>
              )}
              {errorsSignin.email?.type === "pattern" && (
                <p className="g-error-input">Ingresa un email válido</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Email"
                autoComplete="off"
                {...registerSignin("email", {
                  required: true,
                  pattern: emailRegex,
                })}
              />
              {watchSignin("email") === "" ||
              watchSignin("email") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValueSignin("email", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errorsSignin.password && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsSignin.password?.type === "required" && (
                <p className="g-error-input">Ingresa tu contraseña</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Contraseña"
                autoComplete="off"
                className={
                  watchSignin("password") === undefined ||
                  watchSignin("password") === ""
                    ? ""
                    : `${viewPassword.signin ? "" : "g-password"}`
                }
                {...registerSignin("password", {
                  required: true,
                })}
              />
              {watchSignin("password") === "" ||
              watchSignin("password") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValueSignin("password", "")}
                >
                  <CloseIcon />
                </div>
              )}
              {watchSignin("password") === "" ||
              watchSignin("password") ===
                undefined ? null : viewPassword.signin ? (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, signin: false })
                  }
                >
                  <ViewOffIcon />
                </div>
              ) : (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, signin: true })
                  }
                >
                  <ViewIcon />
                </div>
              )}
            </span>
            <span onClick={openForgotPassword} className="g-text-button">
              ¿Has olvidado tu contraseña?
            </span>

            <div>
              <input
                type="submit"
                value="Iniciar sesión"
                className="g-white-button"
              />
            </div>

            <div>
              <span
                onClick={() => handleSign("signup")}
                className="g-text-button"
              >
                ¿No tienes una cuenta? REGÍSTRATE
              </span>
            </div>
          </form>
        )}

        {signSelect === "signup" && (
          <form onSubmit={handleSubmitSignup(signup)}>
            <>
              {!errorsSignup.email && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsSignup.email?.type === "required" && (
                <p className="g-error-input">Ingresa tu email</p>
              )}
              {errorsSignup.email?.type === "pattern" && (
                <p className="g-error-input">Ingresa un email válido</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Email"
                autoComplete="off"
                {...registerSignup("email", {
                  required: true,
                  pattern: emailRegex,
                })}
              />
              {watchSignup("email") === "" ||
              watchSignup("email") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValueSignup("email", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errorsSignup.password && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsSignup.password?.type === "required" && (
                <p className="g-error-input">Ingresa una contraseña</p>
              )}
              {errorsSignup.password?.type === "minLength" && (
                <p className="g-error-input">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Contraseña"
                autoComplete="off"
                className={
                  watchSignup("password") === undefined ||
                  watchSignup("password") === ""
                    ? ""
                    : `${viewPassword.signup ? "" : "g-password"}`
                }
                {...registerSignup("password", {
                  required: true,
                  minLength: 6,
                })}
              />
              {watchSignup("password") === "" ||
              watchSignup("password") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValueSignup("password", "")}
                >
                  <CloseIcon />
                </div>
              )}
              {watchSignup("password") === "" ||
              watchSignup("password") ===
                undefined ? null : viewPassword.signup ? (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, signup: false })
                  }
                >
                  <ViewOffIcon />
                </div>
              ) : (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, signup: true })
                  }
                >
                  <ViewIcon />
                </div>
              )}
            </span>

            <>
              {!errorsSignup.repPassword && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsSignup.repPassword?.type === "required" && (
                <p className="g-error-input">Ingresa una contraseña</p>
              )}
              {errorsSignup.repPassword?.type === "validate" && (
                <p className="g-error-input">Las contraseñas no coinciden</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Repite tu contraseña"
                autoComplete="off"
                className={
                  watchSignup("repPassword") === undefined ||
                  watchSignup("repPassword") === ""
                    ? ""
                    : `${viewPassword.signupRep ? "" : "g-password"}`
                }
                {...registerSignup("repPassword", {
                  required: true,
                  validate: (repPassword) => {
                    if (watchSignup("password") !== repPassword) {
                      return "Las contraseñas no coinciden";
                    }
                  },
                })}
              />
              {watchSignup("repPassword") === "" ||
              watchSignup("repPassword") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValueSignup("repPassword", "")}
                >
                  <CloseIcon />
                </div>
              )}
              {watchSignup("repPassword") === "" ||
              watchSignup("repPassword") ===
                undefined ? null : viewPassword.signupRep ? (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, signupRep: false })
                  }
                >
                  <ViewOffIcon />
                </div>
              ) : (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, signupRep: true })
                  }
                >
                  <ViewIcon />
                </div>
              )}
            </span>

            <input
              type="submit"
              value="Registrarse"
              className="g-white-button"
            />
            <div>
              <span
                onClick={() => handleSign("signin")}
                className="g-text-button"
              >
                ¿Ya tienes una cuenta? INICIA SESIÓN
              </span>
            </div>
          </form>
        )}

        <div className="google-container">
          <span>O ingresa con tu cuenta de Google</span>
          <span className="google-signin-container" id="signInDiv"></span>
          <NavLink to={"/"}>
            <span className="g-back-button g-text-button">
              <ArrowBackIcon />
              {"   regresar"}
            </span>
            {/* //! VOLVER A VER que esto rediriga a la pagina anterior, no a home*/}
          </NavLink>
        </div>
      </div>

      <Modal isOpen={isOpenForgotPassword} closeModal={closeForgotPassword}>
        <div className="signin-container">
          <div className="signin-inner forgot-container">
            <img
              src={require("../../assets/provider-logo.png")}
              alt="logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
            {response ? (
              <>
                <div className="forgot-response">{response}</div>
                <NavLink to={"/"}>
                  <span className="g-back-button g-text-button">
                    <ArrowBackIcon />
                    {"   regresar"}
                  </span>
                  {/* //! VOLVER A VER que esto rediriga a la pagina anterior, no a home*/}
                </NavLink>
              </>
            ) : (
              <form onSubmit={handleSubmitForgot(forgotPassword)}>
                <div className="forgot-text">
                  Ingresa tu email para reestablecer la contraseña
                </div>

                <>
                  {!errorsForgot.email && (
                    <p className="g-hidden-placeholder">hidden</p>
                  )}
                  {errorsForgot.email?.type === "required" && (
                    <p className="g-error-input">Ingresa tu email</p>
                  )}
                  {errorsForgot.email?.type === "pattern" && (
                    <p className="g-error-input">Ingresa un email válido</p>
                  )}
                </>

                <span className="g-input-with-button">
                  <input
                    type="text"
                    placeholder="Email"
                    autoComplete="off"
                    {...registerForgot("email", {
                      required: true,
                      pattern: emailRegex,
                    })}
                  />
                  {watchForgot("email") === "" ||
                  watchForgot("email") === undefined ? null : (
                    <div
                      className="g-input-icon-container g-input-x-button"
                      onClick={() => setValueForgot("email", "")}
                    >
                      <CloseIcon />
                    </div>
                  )}
                </span>

                <div className="forgot-buttons-container">
                  <input
                    type="submit"
                    value="Enviar email"
                    className="g-white-button"
                  />
                  <input
                    type="button"
                    onClick={closeForgotPassword}
                    value="Cancelar"
                    className="g-white-button"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </Modal>
      <Modal isOpen={isOpenLoader}>
        <div className="signin-container">
          <div className="signin-inner forgot-container">
            <LoaderBars />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Signupin;
