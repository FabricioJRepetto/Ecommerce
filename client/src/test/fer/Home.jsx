import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Cart from "./Cart";
import Products from "./Products";
import Signout from "./Signout";
import Signupin from "./Signupin";
import Imagen from "./Imagen";
import ProductForm from "./ProductForm";
import Checkout from "./Checkout";
import { useDispatch, useSelector } from "react-redux";
import { loadToken } from "../../Redux/reducer/sessionSlice";

const Home = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.sessionReducer.token);

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");
    loggedUserToken && dispatch(loadToken(loggedUserToken));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Imagen />} />
        <Route path="/signin" element={token ? <Signout /> : <Signupin />} />
        <Route path="/signout" element={token ? <Signout /> : <Signupin />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productForm" element={<ProductForm />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        </Routes>
      </>
  );
};

export default Home;
