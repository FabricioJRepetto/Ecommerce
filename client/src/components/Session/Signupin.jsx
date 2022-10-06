import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loadingUserData } from "../../Redux/reducer/sessionSlice";
import jwt_decode from "jwt-decode";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNotification } from "../../hooks/useNotification";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import LoaderBars from "../common/LoaderBars";
import { CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import ReturnButton from "../common/ReturnButton";
import { useUserLogin } from "../../hooks/useUserLogin";
import ForgotPassword from "./ForgotPassword";

import "./Signupin.css";
import "../../App.css";

const { REACT_APP_OAUTH_CLIENT_ID } = process.env;

const Signupin = () => {
  const { section } = useParams();
  const [signSelect, setSignSelect] = useState(section || "signin");
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.sessionReducer);
  const [viewPassword, setViewPassword] = useState({
    signin: false,
    signup: false,
    signupRep: false,
  });
  const { userLogin, googleLogin } = useUserLogin();

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

  const location = useLocation();
  const hasPreviousState = location.key !== "default";
  const notification = useNotification();
  const [isOpenLoader, openLoader, closeLoader] = useModal();

  const emailRegex = /^[\w-.]+@([\w-])+[.\w-]*$/i;

  //? CREACION DE CUENTA
  const signup = async (signupData) => {
    openLoader();
    try {
      const { data } = await axios.post(`/user/signup`, signupData);

      if (data.error && data.message && Array.isArray(data.message)) {
        data.message.forEach((error) => notification(error, "", "warning"));
      } else if (data.error) {
        notification(data.message, "", "warning");
      } else if (data.ok) {
        setSignSelect("signin");
        notification(data.message, "", "");
        setValueSignup("email", "");
        setValueSignup("password", "");
        setValueSignup("repPassword", "");
      }
    } catch (error) {
      //! VOLVER A VER manejo de errores
      if (error?.response?.data) {
        notification(error.response.data, "", "error");
      } else if (error.message) {
        notification(error.message, "", "warning");
      } else {
        notification("El servidor está fuera de línea", "", "warning");
      }
    } finally {
      closeLoader();
    }
  };

  //? LOGIN CON MAIL
  const signin = async (signinData) => {
    dispatch(loadingUserData(true));
    try {
      const { data } = await axios.post(`/user/signin`, signinData);

      if (data.error && data.message && Array.isArray(data.message)) {
        data.message.forEach((error) => notification(error, "", "warning"));
      } else if (data.error) {
        notification(data.message, "", "error");
      }

      if (data.user) {
        window.localStorage.setItem("loggedTokenEcommerce", data.token);

        //? Login con el hook
        await userLogin(data.token, true);
      }
    } catch (error) {
      //! VOLVER A VER manejo de errores
      if (error?.response?.data) {
        notification(error.response.data, "", "error");
      } else if (error.message) {
        notification(error.message, "", "warning");
      } else {
        notification("El servidor está fuera de línea", "", "warning");
      }
    } finally {
      dispatch(loadingUserData(false));
    }
  };

  //? LOGIN CON GOOGLE
  const handleCallbackResponse = async (response) => {
    try {
      dispatch(loadingUserData(true));
      //response.credential = Google user token
      const userDecoded = jwt_decode(response.credential);
      const googleToken = "google" + response.credential;

      //? Login con el hook
      googleLogin(googleToken, userDecoded, true);

      window.localStorage.setItem("loggedTokenEcommerce", googleToken);
    } catch (error) {
      console.log(error);
      //! VOLVER A VER manejo de errores
    } finally {
      dispatch(loadingUserData(false));
    }
  };

  useEffect(() => {
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
      theme: "filled_black",
      shape: "square",
    });
    //google.accounts.id.prompt();
    // eslint-disable-next-line
  }, [session]);

  const handleSign = (sign) => {
    setSignSelect(sign);
  };

  const backtoHome = () => {
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  return (
    <div className="signin-container">
      <div
        className={`signin-inner${flag ? " signin-visible" : ""}${
          signSelect === "forgotPassword" ? " signin-forgot-visible" : ""
        }`}
      >
        <img
          src={
            "https://res.cloudinary.com/dsyjj0sch/image/upload/v1659650791/PROVIDER_LOGO_glitch_aberration_kt2hyv.png"
          }
          alt="logo"
          onClick={backtoHome}
          style={{ cursor: "pointer" }}
        />

        <div
          className={`forgot-password-container ${
            signSelect === "forgotPassword" ? "signin-fadeout" : "signin-fadein"
          }`}
        >
          <ForgotPassword openLoader={openLoader} closeLoader={closeLoader} />
          <ReturnButton to={""} onClick={() => handleSign("signin")} />
        </div>

        <div
          className={`signin-signs-container ${
            signSelect === "signin" || signSelect === "signup"
              ? "signin-fadeout"
              : "signin-fadein"
          }`}
        >
          <form
            onSubmit={handleSubmitSignin(signin)}
            className={`${
              signSelect === "signin" ? "signin-fadeout" : "signin-fadein"
            }`}
          >
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
                type={`${
                  watchSignin("password") === undefined ||
                  watchSignin("password") === ""
                    ? "text"
                    : viewPassword.signin
                    ? "text"
                    : "password"
                }`}
                autoComplete="on"
                placeholder="Contraseña"
                className="g-input-two-icons"
                /* className={`g-input-two-icons${
                  watchSignin("password") === undefined ||
                  watchSignin("password") === ""
                    ? ""
                    : viewPassword.signin
                    ? ""
                    : " g-password"
                }`} */
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

            <div>
              <span
                onClick={() => handleSign("forgotPassword")}
                className="g-text-button signin-forgot-text"
              >
                ¿Has olvidado tu contraseña?
              </span>
            </div>

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

          <form
            onSubmit={handleSubmitSignup(signup)}
            className={`${
              signSelect === "signup" ? "signin-fadeout" : "signin-fadein"
            }`}
          >
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
                type={`${
                  watchSignup("password") === undefined ||
                  watchSignup("password") === ""
                    ? "text"
                    : viewPassword.signup
                    ? "text"
                    : "password"
                }`}
                placeholder="Contraseña"
                autoComplete="off"
                className="g-input-two-icons"
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
                <p className="g-error-input">Ingresa la contraseña</p>
              )}
              {errorsSignup.repPassword?.type === "validate" && (
                <p className="g-error-input">Las contraseñas deben coincidir</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type={`${
                  watchSignup("repPassword") === undefined ||
                  watchSignup("repPassword") === ""
                    ? "text"
                    : viewPassword.signupRep
                    ? "text"
                    : "password"
                }`}
                placeholder="Repite tu contraseña"
                autoComplete="off"
                className="g-input-two-icons"
                onPaste={(e) => {
                  e.preventDefault();
                  return false;
                }}
                {...registerSignup("repPassword", {
                  required: true,
                  validate: (repPassword) => {
                    if (watchSignup("password") !== repPassword) {
                      return "Las contraseñas deben coincidir";
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

            <div>
              <input
                type="submit"
                value="Registrarse"
                className="g-white-button"
              />
            </div>

            <div>
              <span
                onClick={() => handleSign("signin")}
                className="g-text-button"
              >
                ¿Ya tienes una cuenta? INICIA SESIÓN
              </span>
            </div>
          </form>

          <div
            className={`${
              signSelect === "signin" || signSelect === "signup"
                ? "signin-fadeout"
                : "signin-fadein"
            }`}
          >
            <div className="google-container">
              <span>O ingresa con tu cuenta de Google</span>
              <span className="google-signin-container" id="signInDiv"></span>
            </div>

            <ReturnButton to={""} onClick={backtoHome} />
          </div>
        </div>
      </div>

      <Modal isOpen={isOpenLoader}>
        <div className="signin-container">
          <div
            className={`signin-inner forgot-container${
              isOpenLoader ? " loader-opacity" : ""
            }`}
          >
            <LoaderBars />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Signupin;
