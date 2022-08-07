import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNotification } from "../../hooks/useNotification";

/* const initialPassword = {
  password: "asdasd@asdasd.com",
  repPassword: "asdasd@asdasd.com",
}; */

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken, userId } = useParams();
  //const [passwordData, setPasswordData] = useState(initialPassword);
  const [notification] = useNotification();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    axios
      .put(
        "/user/resetPassword",
        { _id: userId },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      )
      .catch((err) => {
        //! VOLVER A VER manejo de errores
        console.log(err);
        notification(
          "Link de restablecimiento de password enviado a su email",
          "",
          "success"
        );
        navigate("/signin");
      });
    // eslint-disable-next-line
  }, []);

  /*   const handleChange = ({ target }) => {
    setPasswordData({
      ...passwordData,
      [target.name]: target.value,
    });
  }; */

  const changePassword = (passwordData) => {
    //  e.preventDefault();
    axios
      .put(
        "/user/changePassword",
        { ...passwordData, _id: userId },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      )
      .then(({ data }) => {
        //! VOLVER A VER manejo de errores
        console.log(data);
        notification("Password modificado", "", "success");
        navigate("/signin");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(changePassword)}>
        <>
          {!errors.password && <p className="hidden-placeholder">hidden</p>}
          {errors.password?.type === "required" && <p>Ingresa tu contraseña</p>}
          {errors.password?.type === "minLength" && (
            <p>La contraseña debe tener al menos 6 caracteres</p>
          )}
        </>

        <input
          type="text"
          placeholder="Contraseña"
          {...register("password", {
            required: true,
            minLength: 6,
          })}
        />

        <>
          {!errors.repPassword && <p className="hidden-placeholder">hidden</p>}
          {errors.repPassword?.type === "required" && (
            <p>Ingresa una contraseña</p>
          )}
          {errors.repPassword?.type === "validate" && (
            <p>Las contraseñas no coinciden</p>
          )}
        </>

        <input
          type="text"
          placeholder="Repite tu contraseña"
          {...register("repPassword", {
            required: true,
            validate: (repPassword) => {
              if (watch("password") !== repPassword) {
                return "Las contraseñas no coinciden";
              }
            },
          })}
        />

        <input type="submit" value="Cambiar contraseña" />
      </form>
    </>
  );
};

export default ResetPassword;
