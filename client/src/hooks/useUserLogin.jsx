import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadUserData, loadingUserData } from "../Redux/reducer/sessionSlice";
import { loadCart, loadWishlist } from "../Redux/reducer/cartSlice";
import { useNotification } from "./useNotification";

export const useUserLogin = (token) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notification = useNotification();

  const userLogin = async (token, notif = true) => {
    try {
      const {
        data: { user, cart, wish },
      } = await axios(`/user/profile/${token}`);

      const {
        _id,
        email,
        googleEmail,
        name,
        firstName,
        lastName,
        emailVerified,
        username,
        role,
        isGoogleUser,
        avatar,
      } = user;

      dispatch(
        loadUserData({
          session: true,
          username: username || name,
          full_name: {
            first: firstName || "",
            last: lastName || "",
          },
          avatar: avatar ? avatar : false,
          emailVerified,
          email: googleEmail || email,
          id: _id,
          role,
          isGoogleUser,
        })
      );
      dispatch(loadCart(cart));
      dispatch(loadWishlist(wish));

      notif && notification(`Bienvenido, ${username || name}`, "", "welcome");
    } catch (error) {
      console.error("useUserLogin", error);
      window.localStorage.removeItem("loggedTokenEcommerce");
      dispatch(loadingUserData(false));
      navigate("/");
    } finally {
      dispatch(loadingUserData(false));
    }
  };

  const googleLogin = async (token, userData) => {
    const {
      sub,
      email,
      email_verified: emailVerified,
      picture: avatar,
      given_name: firstName,
      family_name: lastName,
    } = userData;

    try {
      const { data } = await axios.post(`/user/signinGoogle`, {
        sub,
        email,
        emailVerified,
        avatar,
        firstName,
        lastName,
      });

      if (data) userLogin(token);
      // else
    } catch (error) {
      console.log("useUserLogin google: catch" + error); //! VOLVER A VER manejo de errores
      dispatch(loadingUserData(false));
    }
  };

  return {
    userLogin,
    googleLogin,
  };
};
