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
        <input
          type="text"
          placeholder="Password"
          /* name="password"
          onChange={handleSignup}
          value={signupData.password} */
          {...register("password", {
            required: true,
            minLength: 6,
          })}
        />
        {errors.password?.type === "required" && <p>Enter a password</p>}
        {errors.password?.type === "minLength" && (
          <p>Password must be 6 characters long at least</p>
        )}

        <input
          type="text"
          placeholder="Repeat Password"
          /* name="repPassword"
          onChange={handleSignup}
          value={signupData.repPassword} */
          {...register("repPassword", {
            required: true,
            validate: (repPassword) => {
              if (watch("password") !== repPassword) {
                return "Passwords don't match";
              }
            },
          })}
        />
        {errors.repPassword?.type === "required" && <p>Repeat your password</p>}
        {errors.repPassword?.type === "validate" && (
          <p>Passwords don't match</p>
        )}
        <input type="submit" value="Change password" />
      </form>
    </>
  );
};

export default ResetPassword;
