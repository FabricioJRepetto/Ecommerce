import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { BACK_URL } from "../../constants";

const initialPassword = {
  password: "asdasd@asdasd.com",
  repPassword: "asdasd@asdasd.com",
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const [passwordData, setPasswordData] = useState(initialPassword);

  useEffect(() => {
    Axios({
      method: "PUT",
      withCredentials: true,
      url: `${BACK_URL}/user/resetPassword`,
      headers: {
        Authorization: `token ${resetToken}`,
      },
    }).catch((err) => {
      console.log(err); //! VOLVER A VER agregar mensaje y timeout antes de redirigir
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
    Axios({
      method: "PUT",
      data: passwordData,
      withCredentials: true,
      url: `${BACK_URL}/user/changePassword`,
      headers: {
        Authorization: `token ${resetToken}`,
      },
    })
      .then(({ data }) => {
        console.log(data);
        //  navigate("/home"); //! VOLVER A VER agregar mensaje y timeout antes de redirigir
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
