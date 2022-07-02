import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar";
import Cart from "../../components/Cart/Cart";
import Products from "./Products";
import Signout from "../../components/Session/Signout";
import Signupin from "../../components/Session/Signupin";
import Imagen from "./Imagen";
import ProductForm from "./ProductForm";
import Profile from "../../components/Profile/Profile";
import PostSale from "../../components/Cart/PostSale";
import Checkout from "../../components/Cart/Checkout";
import ResetPassword from "../../components/Session/ResetPassword";
import VerifyEmail from "../../components/Session/ResetPassword";
import {
  sessionActive,
  loadUsername,
  loadEmail,
  loadAvatar,
} from "../../Redux/reducer/sessionSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");
    const loggedAvatar = window.localStorage.getItem("loggedAvatarEcommerce");
    const loggedEmail = window.localStorage.getItem("loggedEmailEcommerce");

    (async () => {
      try {
        if (loggedUserToken) {
          const { data } = await axios(`/user/profile/${loggedUserToken}`);
          dispatch(sessionActive(true));
          dispatch(loadUsername(data.name));
          dispatch(loadAvatar(data.avatar ? data.avatar : loggedAvatar));
          dispatch(loadEmail(data.email ? data.email : loggedEmail));
        }
      } catch (error) {
        window.localStorage.removeItem("loggedTokenEcommerce");
        window.localStorage.removeItem("loggedAvatarEcommerce");
        window.localStorage.removeItem("loggedEmailEcommerce");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Imagen />} />
        <Route path="/signin" element={<Signupin />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productForm" element={<ProductForm />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/reset/:userId/:resetToken" element={<ResetPassword />} />
        <Route path="/orders/post-sale/:id" element={<PostSale />} />
        <Route path="/verify/:verifyToken" element={<VerifyEmail />} />
      </Routes>
    </>
  );
};

export default Home;
