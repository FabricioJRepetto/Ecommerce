import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadToken, loadUsername } from "../../Redux/reducer/sessionSlice";
import { useNavigate } from "react-router-dom";

const Signout = () => {
  const sessionState = useSelector((state) => state.sessionReducer);
  const { token, username } = sessionState;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    window.localStorage.removeItem("loggedTokenEcommerce");
    dispatch(loadToken(null));
    dispatch(loadUsername(null));
    navigate("/signin");
  };

  useEffect(() => {
    console.log(username);
    if (!token) navigate("/signin");
  }, []);

  return (
    <>
      <hr />
      <h2>USER</h2>
      {username && <h1>{username}</h1>}
      <button onClick={signOut}>Sign Out</button>
    </>
  );
};

export default Signout;
