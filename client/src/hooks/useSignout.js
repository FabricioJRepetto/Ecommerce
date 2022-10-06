import { useDispatch, useSelector } from "react-redux";
import { reconnectNeeded, loadUserData } from "../Redux/reducer/sessionSlice";
import { useNavigate } from "react-router-dom";
import { resetCartSlice } from "../Redux/reducer/cartSlice";
import { useNotification } from "./useNotification";

export const useSignout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notification = useNotification();
  const session = useSelector((state) => state.sessionReducer.session);

  function signOut(notif) {
    if (session) {
    }

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
        emailVerified: null,
        id: null,
        role: null,
        isGoogleUser: null,
      })
    );
    dispatch(resetCartSlice());
    navigate("/");

    if (notif) {
      notification(
        "Por favor vuelve a iniciar sesión",
        "/signin",
        "error",
        true
      );
      dispatch(reconnectNeeded(false));
    }
  }

  function handleOff() {
    const app = document.getElementById("root");
    const whiteBoard = document.getElementById("white-board");
    const blackBoard = document.getElementById("black-board");
    app.classList.add("off-closed");
    whiteBoard.classList.add("off-showed");
    blackBoard.classList.add("off-showed");
    setTimeout(() => {
      app.classList.remove("off-closed");
      whiteBoard.classList.remove("off-showed");
      blackBoard.classList.add("off-fadein");
    }, 1000);
    setTimeout(() => {
      blackBoard.classList.remove("off-showed");
      blackBoard.classList.remove("off-fadein");
    }, 1500);
  }

  return { signOut, handleOff };
};
