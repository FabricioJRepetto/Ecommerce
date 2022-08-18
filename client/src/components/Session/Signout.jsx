import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUserData } from "../../Redux/reducer/sessionSlice";
import { useNavigate } from "react-router-dom";
import { resetCartSlice } from "../../Redux/reducer/cartSlice";

const Signout = () => {
  const { session } = useSelector((state) => state.sessionReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    window.localStorage.removeItem("loggedTokenEcommerce");
    dispatch(
      loadUserData({
        session: false,
        username: null,
        full_name: {
          first: null,
          last: null,
        },
        avatar: null,
        email: null,
        id: null,
        role: null,
        isGoogleUser: null,
      })
    );
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
