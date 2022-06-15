import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import Cart from "./Cart";
import Products from "./Products";
import Signout from "./Signout";
import Signupin from "./Signupin";
import Imagen from "./Imagen";
import ProductForm from "./ProductForm";
import PostSale from "./PostSale";
import Checkout from "./Checkout";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import { sessionActive, loadUsername } from "../../Redux/reducer/sessionSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");

    loggedUserToken &&
      axios(`/user/profile`)
        .then(({ data }) => {
          dispatch(sessionActive(true));
          dispatch(loadUsername(data.user.email));
        })
        .catch((_) => window.localStorage.removeItem("loggedTokenEcommerce"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Imagen />} />
        <Route path="/signin" element={<Signupin />} />
        <Route path="/signout" element={<Signout />} />
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
