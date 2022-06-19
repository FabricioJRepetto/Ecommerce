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
import Profile from "./Profile";
import PostSale from "./PostSale";
import Checkout from "./Checkout";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import { sessionActive, loadUsername, loadEmail, loadAvatar } from "../../Redux/reducer/sessionSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");
    
        (async ()=>{
            try {
                if (loggedUserToken) {                    
                    const { data } = await axios(`/user/profile/${loggedUserToken}`);
                    console.log(data);
                    dispatch(sessionActive(true));
                    dispatch(loadUsername(data.name));
                    dispatch(loadEmail(data.email));
                    dispatch(loadAvatar(data.avatar));
                }
            } catch (error) {
                window.localStorage.removeItem("loggedTokenEcommerce")
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
