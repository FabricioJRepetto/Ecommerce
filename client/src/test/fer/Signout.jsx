import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loadToken, loadUsername } from "../../Redux/reducer/sessionSlice";
import { BACK_URL } from "./constants";
import { useNavigate } from "react-router-dom";

const Signout = () => {
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.sessionReducer.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${BACK_URL}/user/profile`, //! VOLVER A VER cambiar
      headers: {
        Authorization: `token ${token}`,
      },
    }).then((res) => {
      setUserData(res.data.user);
      console.log(res.data);
    });
  };

  const signOut = () => {
    window.localStorage.removeItem("loggedTokenEcommerce");
    dispatch(loadToken(null));
    dispatch(loadUsername(null));
  };

  useEffect(() => {
    if (!token) navigate("/signin");
  }, []);

  return (
    <>
      <hr />
      <h2>USER</h2>
      {userData && <h1>{userData.email}</h1>}
      <button onClick={getUser}>Get User</button>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
};

export default Signout;
