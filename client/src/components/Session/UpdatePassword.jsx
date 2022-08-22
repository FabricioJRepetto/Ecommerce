import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import { avoidEnterSubmit } from "../../helpers/AvoidEnterSubmit";
import LoaderBars from "../common/LoaderBars";
import {
  CloseIcon,
  ArrowBackIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import "../../App.css";
import "./UpdatePassword.css";

const UpdatePassword = () => {
  const [viewPassword, setViewPassword] = useState({
    oldPassword: false,
    password: false,
    repPassword: false,
  });
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
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

      console.log(data);

      if (data.error && data.message && Array.isArray(data.message)) {
        data.message.forEach((error) => notification(error, "", "error"));
      } else {
        data.message && setResponse(data.message);
      }
    } catch (error) {
      console.log(error);
      //setResponse(error.response.data.message); //! VOLVER A VER manejo de errores
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-inner">
      {loading ? (
        <LoaderBars />
      ) : response ? (
        <>
          <div className="change-password-response">{response}</div>
          <NavLink to={"/profile/details"}>
            <span className="g-back-button g-text-button">
              <ArrowBackIcon />
              {"   regresar"}
            </span>
          </NavLink>
        </>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(updatePassword)}
            onKeyDown={avoidEnterSubmit}
          >
            {/* <div className="reset-text">Ingresa tu nueva contraseña</div> */}

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
                className={`g-input-two-icons ${
                  watch("oldPassword") === undefined ||
                  watch("oldPassword") === ""
                    ? ""
                    : viewPassword.oldPassword
                    ? ""
                    : "g-password"
                }`}
                {...register("oldPassword", {
                  //required: true,
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
                className={`g-input-two-icons ${
                  watch("password") === undefined || watch("password") === ""
                    ? ""
                    : viewPassword.password
                    ? ""
                    : "g-password"
                }`}
                {...register("password", {
                  // required: true,
                  //minLength: 6,
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
                <p className="g-error-input">Las contraseñas no coinciden</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Repite la contraseña"
                autoComplete="off"
                className={`g-input-two-icons ${
                  watch("repPassword") === undefined ||
                  watch("repPassword") === ""
                    ? ""
                    : viewPassword.repPassword
                    ? ""
                    : "g-password"
                }`}
                {...register("repPassword", {
                  /* required: true,
                  validate: (repPassword) => {
                    if (watch("password") !== repPassword) {
                      return "Las contraseñas no coinciden";
                    }
                  }, */
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
            />
          </form>
          <NavLink to={"/profile/details"}>
            <span className="g-back-button g-text-button">
              <ArrowBackIcon />
              {"   regresar"}
            </span>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default UpdatePassword;
