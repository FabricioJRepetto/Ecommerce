import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const initialPassword = {
  password: "asdasd@asdasd.com",
  repPassword: "asdasd@asdasd.com",
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken, userId } = useParams();
  const [passwordData, setPasswordData] = useState(initialPassword);

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
        //! VOLVER A VER agregar mensaje y timeout antes de redirigir
        console.log(err);
        navigate("/signin");
      });
  }, []);

  const handleChange = ({ target }) => {
    setPasswordData({
      ...passwordData,
      [target.name]: target.value,
    });
  };

  const changePassword = (e) => {
    e.preventDefault();
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
        //! VOLVER A VER agregar mensaje y timeout antes de redirigir
        console.log(data);
        navigate("/signin");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <form onSubmit={changePassword}>
        <h2>Change password</h2>
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={passwordData.password}
        />
        <input
          type="text"
          name="repPassword"
          placeholder="repPassword"
          onChange={handleChange}
          value={passwordData.repPassword}
        />
        <input type="submit" value="Change password" />
      </form>
    </>
  );
};

export default ResetPassword;
