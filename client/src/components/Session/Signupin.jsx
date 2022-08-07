import { useState, useEffect } from "react";
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
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";
const { REACT_APP_OAUTH_CLIENT_ID } = process.env;

const Signupin = () => {
  const [signSelect, setSignSelect] = useState("signin");
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.sessionReducer);
  const [response, setResponse] = useState(null);

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
      console.log(data);
    } catch (error) {
      console.log(error);
      //! VOLVER A VER agregar notif de email
      //! VOLVER A VER manejo de errores
    } finally {
      closeLoader();
    }
  };

  //? LOGIN CON MAIL
  const signin = async (signinData) => {
    openLoader();
    try {
      const { data } = await axios.post(`/user/signin`, signinData);

      if (data.user) {
        window.localStorage.setItem("loggedTokenEcommerce", data.token);
        dispatch(sessionActive(true));

        notification(`Bienvenido, ${data.user.name}`, "", "success");
      }
    } catch (error) {
      notification(error.response.data.message, "", "error");
      //! VOLVER A VER manejo de errores
    } finally {
      closeLoader();
    }
  };

  //? LOGIN CON GOOGLE
  const handleCallbackResponse = async (response) => {
    openLoader();
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
      console.log(error); //! VOLVER A VER manejo de errores
    } finally {
      closeLoader();
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

  useEffect(() => {
    setValueSignin("email", "fer.eze.ram@gmail.com");
    setValueSignin("password", "fer.eze.ram@gmail.com");
    setValueSignup("email", "fer.eze.ram@gmail.com");
    setValueSignup("password", "fer.eze.ram@gmail.com");
    setValueSignup("repPassword", "fer.eze.ram@gmail.com");
    setValueForgot("email", "fer.eze.ram@gmail.com");
  }, []);

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
        {/* <div className="sign-select-container">
          <div
            onClick={() => handleSign("signin")}
            className={`sign-select ${
              signSelect === "signin"
                ? "sign-active"
                : "sign-inactive signin-inactive"
            }`}
          >
            SIGN IN
          </div>
          <div
            onClick={() => handleSign("signup")}
            className={`sign-select ${
              signSelect === "signup"
                ? "sign-active"
                : "sign-inactive signup-inactive"
            }`}
          >
            SIGN UP
          </div>
        </div> */}
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
                <p className="hidden-placeholder">hidden</p>
              )}
              {errorsSignin.email?.type === "required" && (
                <p className="error-sign">Ingresa tu email</p>
              )}
              {errorsSignin.email?.type === "pattern" && (
                <p className="error-sign">Ingresa un email válido</p>
              )}
            </>

            <span className="input-with-button">
              <input
                type="text"
                placeholder="Email"
                autoComplete="off"
                {...registerSignin("email", {
                  required: true,
                  pattern: emailRegex,
                })}
              />
              {watchSignin("email") !== "" && (
                <div
                  className="x-container"
                  onClick={() => setValueSignin("email", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errorsSignin.password && (
                <p className="hidden-placeholder">hidden</p>
              )}
              {errorsSignin.password?.type === "required" && (
                <p className="error-sign">Ingresa tu contraseña</p>
              )}
            </>

            <span className="input-with-button">
              <input
                type="text"
                placeholder="Contraseña"
                autoComplete="off"
                className={
                  watchSignin("password") === undefined ||
                  watchSignin("password") === ""
                    ? ""
                    : "password"
                }
                {...registerSignin("password", {
                  required: true,
                })}
              />
              {watchSignin("password") !== "" && (
                <div
                  className="x-container"
                  onClick={() => setValueSignin("password", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>
            <span onClick={openForgotPassword} className="text-button">
              ¿Has olvidado tu contraseña?
            </span>

            <div>
              <input type="submit" value="Sign In" className="sign-button" />
            </div>

            <div>
              <span
                onClick={() => handleSign("signup")}
                className="text-button"
              >
                ¿No tienes una cuenta? SIGN UP
              </span>
            </div>
          </form>
        )}

        {signSelect === "signup" && (
          <form onSubmit={handleSubmitSignup(signup)}>
            <>
              {!errorsSignup.email && (
                <p className="hidden-placeholder">hidden</p>
              )}
              {errorsSignup.email?.type === "required" && (
                <p className="error-sign">Ingresa tu email</p>
              )}
              {errorsSignup.email?.type === "pattern" && (
                <p className="error-sign">Ingresa un email válido</p>
              )}
            </>

            <span className="input-with-button">
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
                  className="x-container"
                  onClick={() => setValueSignup("email", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errorsSignup.password && (
                <p className="hidden-placeholder">hidden</p>
              )}
              {errorsSignup.password?.type === "required" && (
                <p className="error-sign">Ingresa una contraseña</p>
              )}
              {errorsSignup.password?.type === "minLength" && (
                <p className="error-sign">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </>

            <span className="input-with-button">
              <input
                type="text"
                placeholder="Contraseña"
                autoComplete="off"
                className={
                  watchSignup("password") === undefined ||
                  watchSignup("password") === ""
                    ? ""
                    : "password"
                }
                {...registerSignup("password", {
                  required: true,
                  minLength: 6,
                })}
              />
              {watchSignup("password") === "" ||
              watchSignup("password") === undefined ? null : (
                <div
                  className="x-container"
                  onClick={() => setValueSignup("password", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errorsSignup.repPassword && (
                <p className="hidden-placeholder">hidden</p>
              )}
              {errorsSignup.repPassword?.type === "required" && (
                <p className="error-sign">Ingresa una contraseña</p>
              )}
              {errorsSignup.repPassword?.type === "validate" && (
                <p className="error-sign">Las contraseñas no coinciden</p>
              )}
            </>

            <span className="input-with-button">
              <input
                type="text"
                placeholder="Repite tu contraseña"
                autoComplete="off"
                className={
                  watchSignup("repPassword") === undefined ||
                  watchSignup("repPassword") === ""
                    ? ""
                    : "password"
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
                  className="x-container"
                  onClick={() => setValueSignup("repPassword", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <input type="submit" value="Sign Up" className="sign-button" />
            <div>
              <span
                onClick={() => handleSign("signin")}
                className="text-button"
              >
                ¿Ya tienes una cuenta? SIGN IN
              </span>
            </div>
          </form>
        )}

        <div className="google-container">
          <span>O ingresa con tu cuenta de Google</span>
          <span className="google-signin-container" id="signInDiv"></span>
          <NavLink to={"/"}>
            <span className="back-button text-button">
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
                  <span className="back-button text-button">
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
                    <p className="hidden-placeholder">hidden</p>
                  )}
                  {errorsForgot.email?.type === "required" && (
                    <p className="error-sign">Ingresa tu email</p>
                  )}
                  {errorsForgot.email?.type === "pattern" && (
                    <p className="error-sign">Ingresa un email válido</p>
                  )}
                </>

                <span className="input-with-button">
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
                      className="x-container"
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
                    className="sign-button"
                  />
                  <input
                    type="button"
                    onClick={closeForgotPassword}
                    value="Cancelar"
                    className="sign-button"
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
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
            <h1>CARGANDO</h1>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Signupin;
