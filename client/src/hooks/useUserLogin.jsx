import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadUserData,
  loadingUserData,
  loadNotifications,
} from "../Redux/reducer/sessionSlice";
import { loadCart, loadWishlist } from "../Redux/reducer/cartSlice";
import { useNotification } from "./useNotification";

export const useUserLogin = (token) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notification = useNotification();

  const userLogin = async (token, welcome = false) => {
    try {
      const {
        data: { user, cart, wish, notif },
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
      dispatch(loadNotifications(notif));

      welcome && notification(`Bienvenido, ${username || name}`, "", "welcome");
    } catch (error) {
      console.error("useUserLogin", error);
      window.localStorage.removeItem("loggedTokenEcommerce");
      navigate("/");
    } finally {
      dispatch(loadingUserData(false));
    }
  };

  const googleLogin = async (token, userData, notif = false) => {
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

      console.log(data);

      if (data.error) {
        console.log(data);
        window.localStorage.removeItem("loggedTokenEcommerce");
        return notification(data.message, "", "error");
      } else if (data) {
        userLogin(token, notif);
      }
      // else
    } catch (error) {
      console.error("useUserLogin google: catch " + error);
      console.log("entra", error);

      if (error?.response?.data) {
        notification(error.response.data, "", "error");
      } else if (error.message) {
        notification(error.message, "", "warning");
      } else {
        notification("El servidor está fuera de línea", "", "warning");
      }
    } finally {
      dispatch(loadingUserData(false));
    }
  };

  return {
    userLogin,
    googleLogin,
  };
};
