import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Cart from "./Cart";
import Products from "./Products";
import Signout from "./Signout";
import Signupin from "./Signupin";
import Imagen from "./Imagen";
import ProductForm from "./ProductForm";
import { useDispatch } from "react-redux";
import Checkout from "./Checkout";
import { loadToken, loadUsername } from "../../Redux/reducer/sessionSlice";
import { BACK_URL } from "../../constants";
import Axios from "axios";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");

    loggedUserToken &&
      Axios(`/user/profile`)
        .then(({ data }) => {
          dispatch(loadToken(loggedUserToken));
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
      </Routes>
    </>
  );
};

export default Home;
