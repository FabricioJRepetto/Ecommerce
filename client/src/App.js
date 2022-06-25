import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import {
  loadAvatar,
  loadEmail,
  loadUsername,
  sessionActive,
} from "./Redux/reducer/sessionSlice";
import { loadProducts } from "./Redux/reducer/cartSlice";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import NavBar from "./components/NavBar/NavBar";
import Signupin from "./components/Session/Signupin";
import Signout from "./components/Session/Signout";
import ResetPassword from "./components/Session/ResetPassword";
import VerifyEmail from "./components/Session/VerifyEmail";
import Profile from "./components/Profile/Profile";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Cart/Checkout";
import PostSale from "./components/Cart/PostSale";
import Products from "./test/fer/Products";
import ProductForm from "./test/fer/ProductForm";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");
    const loggedAvatar = window.localStorage.getItem("loggedAvatarEcommerce");
    const loggedEmail = window.localStorage.getItem("loggedEmailEcommerce");

    (async () => {
      try {
        if (loggedUserToken) {
          const { data } = await axios(`/user/profile/${loggedUserToken}`);
          console.log(data);
          dispatch(sessionActive(true));
          dispatch(loadUsername(data.name));
          dispatch(loadAvatar(data.avatar ? data.avatar : loggedAvatar));
          dispatch(loadEmail(data.email ? data.email : loggedEmail));

          const { data: cart } = await axios(`/cart`);
          dispatch(loadProducts(cart.products.length));
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
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
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
    </div>
  );
}

export default App;
