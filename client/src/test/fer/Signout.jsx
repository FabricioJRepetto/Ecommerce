import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sessionActive, loadUsername, loadAvatar, loadEmail } from "../../Redux/reducer/sessionSlice";
import { useNavigate } from "react-router-dom";

const Signout = () => {
  const sessionState = useSelector((state) => state.sessionReducer);
  const { session } = sessionState;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    window.localStorage.removeItem("loggedTokenEcommerce");
    window.localStorage.removeItem("loggedAvatarEcommerce");
    window.localStorage.removeItem("loggedEmailEcommerce");
    dispatch(sessionActive(false));
    dispatch(loadUsername(null));
    dispatch(loadAvatar(null));
    dispatch(loadEmail(null));
    navigate("/signin");
  };

  useEffect(() => {
    if (!session) navigate("/signin");
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <button onClick={signOut}><b>Sign Out</b></button>
    </>
  );
};

export default Signout;
