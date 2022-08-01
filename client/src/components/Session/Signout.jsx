import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  sessionActive,
  loadUsername,
  loadAvatar,
  loadEmail,
  loadRole,
} from "../../Redux/reducer/sessionSlice";
import { useNavigate } from "react-router-dom";
import { resetCartSlice } from "../../Redux/reducer/cartSlice";

const Signout = () => {
  const { session } = useSelector((state) => state.sessionReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    window.localStorage.removeItem("loggedTokenEcommerce");
    dispatch(sessionActive(false));
    dispatch(loadUsername(null));
    dispatch(loadAvatar(null));
    dispatch(loadEmail(null));
    dispatch(loadRole(null));
    dispatch(resetCartSlice());
    navigate("/");
  };

  useEffect(() => {
    if (!session) navigate("/");
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <button onClick={signOut}>
        <b>Salir</b>
      </button>
    </>
  );
};

export default Signout;
