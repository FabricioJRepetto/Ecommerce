import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { CloseIcon } from "@chakra-ui/icons";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import LoaderBars from "../common/LoaderBars";
import { useNotification } from "../../hooks/useNotification";
import ReturnButton from "../common/ReturnButton";

import "./ForgotPassword.css";
import "../../App.css";

const ForgotPassword = ({ openLoader, closeLoader }) => {
  const { session } = useSelector((state) => state.sessionReducer);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const notification = useNotification();
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
    setValue: setValueForgot,
    watch: watchForgot,
  } = useForm();
  //const [isOpenLoader, openLoader, closeLoader] = useModal();

  const emailRegex = /^[\w-.]+@([\w-])+[.\w-]*$/i;

  const forgotPassword = async (email) => {
    openLoader();
    try {
      const { data } = await axios.put("/user/forgotPassword", email);

      if (data.error && data.message && Array.isArray(data.message)) {
        data.message.forEach((error) => notification(error, "", "warning"));
      } else if (data.error) {
        notification(data.message, "", "warning");
      } else {
        setResponse(data.message);
      }
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
        {response ? (
          <>
            <div className="forgot-response">{response}</div>
            {/* <ReturnButton to={"/"} /> */}
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
            </div>
          </form>
        )}
      </div>
      {/* <Modal isOpen={isOpenLoader}>
        <div className="signin-container">
          <div className="signin-inner forgot-container">
            <LoaderBars />
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default ForgotPassword;
