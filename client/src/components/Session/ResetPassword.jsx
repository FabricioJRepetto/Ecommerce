import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNotification } from "../../hooks/useNotification";
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";
import "./ResetPassword.css";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken, userId } = useParams();
  const [notification] = useNotification();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const [isOpenLoader, openLoader, closeLoader] = useModal();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await axios.put(
          "/user/resetPassword",
          { _id: userId },
          {
            headers: {
              Authorization: `Bearer ${resetToken}`,
            },
          }
        );
      } catch (error) {
        //! VOLVER A VER manejo de errores
        console.log("error", error);
        notification("Link de recuperación vencido", "", "error");
        navigate("/signin");
      }
    })();
    // eslint-disable-next-line
  }, []);

  const changePassword = async (passwordData) => {
    openLoader();
    try {
      const { data } = await axios.put(
        "/user/changePassword",
        { ...passwordData, _id: userId },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );
      setResponse(data.message);
      setTimeout(() => {
        navigate("/signin");
      }, 4000);
    } catch (error) {
      console.log(error);
      setResponse(error.response.data.message); //! VOLVER A VER manejo de errores
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } finally {
      closeLoader();
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-inner">
        <img
          src={require("../../assets/provider-logo.png")}
          alt="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        {response ? (
          <>
            <div className="reset-response">{response}</div>
            <NavLink to={"/"}>
              <span className="back-button text-button">
                <ArrowBackIcon />
                {"   regresar"}
              </span>
              {/* //! VOLVER A VER que esto rediriga a la pagina anterior, no a home*/}
            </NavLink>
          </>
        ) : (
          <form onSubmit={handleSubmit(changePassword)}>
            <div className="reset-text">Ingresa tu nueva contraseña</div>

            <>
              {!errors.password && <p className="hidden-placeholder">hidden</p>}
              {errors.password?.type === "required" && (
                <p className="error-sign">Ingresa una contraseña</p>
              )}
              {errors.password?.type === "minLength" && (
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
                  watch("password") === undefined || watch("password") === ""
                    ? ""
                    : "password"
                }
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
              />
              {watch("password") === "" ||
              watch("password") === undefined ? null : (
                <div
                  className="x-container"
                  onClick={() => setValue("password", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errors.repPassword && (
                <p className="hidden-placeholder">hidden</p>
              )}
              {errors.repPassword?.type === "required" && (
                <p className="error-sign">Ingresa tu contraseña</p>
              )}
              {errors.repPassword?.type === "validate" && (
                <p className="error-sign">Las contraseñas no coinciden</p>
              )}
            </>

            <span className="input-with-button">
              <input
                type="text"
                placeholder="Repite tu contraseña"
                autoComplete="off"
                className={
                  watch("repPassword") === undefined ||
                  watch("repPassword") === ""
                    ? ""
                    : "password"
                }
                {...register("repPassword", {
                  required: true,
                  validate: (repPassword) => {
                    if (watch("repPassword") !== repPassword) {
                      return "Las contraseñas no coinciden";
                    }
                  },
                })}
              />
              {watch("repPassword") === "" ||
              watch("repPassword") === undefined ? null : (
                <div
                  className="x-container"
                  onClick={() => setValue("repPassword", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <input
              type="submit"
              value="Cambiar contraseña"
              className="sign-button"
            />
          </form>
        )}
      </div>
      <Modal isOpen={isOpenLoader}>
        <div className="reset-container">
          <div className="reset-inner loader-container">
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

export default ResetPassword;
