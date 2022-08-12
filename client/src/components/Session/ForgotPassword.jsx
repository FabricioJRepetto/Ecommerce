import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import LoaderBars from "../common/LoaderBars";
import "../../App.css";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
    setValue: setValueForgot,
    watch: watchForgot,
  } = useForm();
  const [isOpenLoader, openLoader, closeLoader] = useModal();

  const emailRegex = /^[\w-.]+@([\w-])+[.\w-]*$/i;

  useEffect(() => {
    setValueForgot("email", "fer.eze.ram@gmail.com");
    // eslint-disable-next-line
  }, []);

  const forgotPassword = async (email) => {
    openLoader();
    try {
      const { data } = await axios.put("/user/forgotPassword", email);
      setResponse(data.message);
    } catch (error) {
      console.log(error);
      //! VOLVER A VER manejo de errores
    } finally {
      closeLoader();
    }
  };

  return (
    <div className="forgot-outer-container">
      <div className="forgot-inner forgot-container">
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

              <span className="g-navlink-white-button navlink-container">
                <NavLink to={"/signin"}>Cancelar</NavLink>
              </span>
            </div>
          </form>
        )}
      </div>
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

export default ForgotPassword;
