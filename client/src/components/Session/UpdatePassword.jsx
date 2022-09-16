import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import { avoidEnterSubmit } from "../../helpers/AvoidEnterSubmit";
import LoaderBars from "../common/LoaderBars";
import { CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import ReturnButton from "../common/ReturnButton";
import "../../App.css";
import "./UpdatePassword.css";

const UpdatePassword = () => {
  const [viewPassword, setViewPassword] = useState({
    oldPassword: false,
    password: false,
    repPassword: false,
  });
  const [response, setResponse] = useState("");
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email } = useSelector((state) => state.sessionReducer);
  const [notification] = useNotification();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const updatePassword = async (passwordData) => {
    setLoading(true);
    try {
      const { data } = await axios.put("/user/updatePassword", passwordData);

      if (data.error && data.message && Array.isArray(data.message)) {
        data.message.forEach((error) => notification(error, "", "error"));
      } else if (data.error) {
        notification(data.message, "", "error");
      } else {
        data.message && setResponse(data.message);
      }
    } catch (error) {
      console.log(error);
      //! VOLVER A VER manejo de errores
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (waitingResponse) return;
    setWaitingResponse(true);
    try {
      const { data } = await axios.put("/user/forgotPassword", { email });

      if (data.error && data.message && Array.isArray(data.message)) {
        data.message.forEach((error) => notification(error, "", "warning"));
      } else if (data.error) {
        notification(data.message, "", "warning");
      } else {
        data.message && setResponse(data.message);
      }
    } catch (error) {
      console.log(error);
      //! VOLVER A VER manejo de errores
    } finally {
      setWaitingResponse(false);
    }
  };

  return (
    <div className="change-inner">
      {loading ? (
        <LoaderBars />
      ) : response ? (
        <>
          <div className="change-password-response">{response}</div>
          <ReturnButton to={"/profile/details"} />
        </>
      ) : (
        <>
          <h1>Cambiar contraseña</h1>
          <form
            onSubmit={handleSubmit(updatePassword)}
            onKeyDown={avoidEnterSubmit}
          >
            <div className="title-text">Ingresa tu actual contraseña</div>
            <>
              {!errors.oldPassword && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errors.oldPassword?.type === "required" && (
                <p className="g-error-input">Ingresa tu contraseña</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Contraseña"
                autoComplete="off"
                className={`g-input-two-icons${
                  watch("oldPassword") === undefined ||
                  watch("oldPassword") === ""
                    ? ""
                    : viewPassword.oldPassword
                    ? ""
                    : " g-password"
                }`}
                {...register("oldPassword", {
                  required: true,
                })}
              />
              {watch("oldPassword") === "" ||
              watch("oldPassword") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("oldPassword", "")}
                >
                  <CloseIcon />
                </div>
              )}

              {watch("oldPassword") === "" ||
              watch("oldPassword") ===
                undefined ? null : viewPassword.oldPassword ? (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, oldPassword: false })
                  }
                >
                  <ViewOffIcon />
                </div>
              ) : (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, oldPassword: true })
                  }
                >
                  <ViewIcon />
                </div>
              )}
            </span>
            <div className="title-text">
              <span
                className="input-bottom-text g-text-button"
                onClick={forgotPassword}
              >
                Olvidé mi contraseña
              </span>
            </div>

            <div className="title-text input-margin-top">
              Ingresa tu nueva contraseña
            </div>

            <>
              {!errors.password && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errors.password?.type === "required" && (
                <p className="g-error-input">Ingresa una contraseña</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="g-error-input">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Nueva contraseña"
                autoComplete="off"
                className={`g-input-two-icons${
                  watch("password") === undefined || watch("password") === ""
                    ? ""
                    : viewPassword.password
                    ? ""
                    : " g-password"
                }`}
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
              />
              {watch("password") === "" ||
              watch("password") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("password", "")}
                >
                  <CloseIcon />
                </div>
              )}

              {watch("password") === "" ||
              watch("password") === undefined ? null : viewPassword.password ? (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, password: false })
                  }
                >
                  <ViewOffIcon />
                </div>
              ) : (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, password: true })
                  }
                >
                  <ViewIcon />
                </div>
              )}
            </span>

            <>
              {!errors.repPassword && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errors.repPassword?.type === "required" && (
                <p className="g-error-input">Ingresa la contraseña</p>
              )}
              {errors.repPassword?.type === "validate" && (
                <p className="g-error-input">Las contraseñas deben coincidir</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Repite la contraseña"
                autoComplete="off"
                className={`g-input-two-icons${
                  watch("repPassword") === undefined ||
                  watch("repPassword") === ""
                    ? ""
                    : viewPassword.repPassword
                    ? ""
                    : " g-password"
                }`}
                onPaste={(e) => {
                  e.preventDefault();
                  return false;
                }}
                {...register("repPassword", {
                  required: true,
                  validate: (repPassword) => {
                    if (watch("password") !== repPassword) {
                      return "Las contraseñas deben coincidir";
                    }
                  },
                })}
              />
              {watch("repPassword") === "" ||
              watch("repPassword") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("repPassword", "")}
                >
                  <CloseIcon />
                </div>
              )}

              {watch("repPassword") === "" ||
              watch("repPassword") ===
                undefined ? null : viewPassword.repPassword ? (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, repPassword: false })
                  }
                >
                  <ViewOffIcon />
                </div>
              ) : (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, repPassword: true })
                  }
                >
                  <ViewIcon />
                </div>
              )}
            </span>

            <input
              type="submit"
              value="Cambiar contraseña"
              className="g-white-button"
              disabled={waitingResponse}
            />
          </form>
          <ReturnButton to={"/profile/details"} />
        </>
      )}
    </div>
  );
};

export default UpdatePassword;
