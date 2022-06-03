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
import { loadToken } from "../../Redux/reducer/sessionSlice";

const Home = () => {
  const dispatch = useDispatch();

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
        <Route path="/signin" element={<Signupin />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productForm" element={<ProductForm />} />
        <Route path="/cart" element={<Cart />} />
        </Routes>
      </>
  );
};

export default Home;
