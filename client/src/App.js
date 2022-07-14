import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  loadAvatar,
  loadEmail,
  loadUsername,
  sessionActive,
  loadRole,
} from "./Redux/reducer/sessionSlice";
import { loadCart, loadWhishlist } from "./Redux/reducer/cartSlice";
import axios from "axios";
import "./App.css";

import Home from "./components/Home/Home";
import Notification from "./components/common/Notification";
import NavBar from "./components/NavBar/NavBar";
import Signupin from "./components/Session/Signupin";
import Signout from "./components/Session/Signout";
import ResetPassword from "./components/Session/ResetPassword";
import VerifyEmail from "./components/Session/VerifyEmail";
import Profile from "./components/Profile/Profile";
import Cart from "./components/Cart/Cart";
import BuyNow from "./components/Cart/BuyNow";
import Checkout from "./components/Cart/Checkout";
import PostSale from "./components/Cart/PostSale";
import Products from "./test/fer/Products";
import ProductForm from "./test/fer/ProductForm";
import Details from "./components/Products/Details";
import Results from "./components/Products/Results";
import AdminLayout from "./test/fer/AdminLayout";
import Orders from "./test/fer/Orders";

import BackToTop from "./helpers/backToTop/BackToTop";
import RequireRole from "./test/fer/RequireRole";
import Users from "./test/fer/Users";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");
    const loggedAvatar = window.localStorage.getItem("loggedAvatarEcommerce");
    const loggedEmail = window.localStorage.getItem("loggedEmailEcommerce");

    (async () => {
      try {
        if (loggedUserToken) {
          const { data } = await axios(`/user/profile/${loggedUserToken}`); //! VOLVER A VER fijarse con nuevos usuarios de google
          dispatch(sessionActive(true));
          dispatch(loadUsername(data.name));
          dispatch(loadAvatar(data.avatar ? data.avatar : loggedAvatar)); //! VOLVER A VER ojo con esto, puede ser que quede guardado el avatar de otro user
          dispatch(loadEmail(data.email ? data.email : loggedEmail));
          dispatch(loadRole(data.role));

          const { data: cart } = await axios(`/cart`);
          dispatch(loadCart(cart.id_list));

          const { data: whish } = await axios(`/whishlist`);
          dispatch(loadWhishlist(whish.id_list));
        }
      } catch (error) {
        navigate("/");
        window.localStorage.removeItem("loggedTokenEcommerce");
        window.localStorage.removeItem("loggedAvatarEcommerce");
        window.localStorage.removeItem("loggedEmailEcommerce");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App" id="scroller">
      <NavBar />
      <Notification />
      <BackToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signupin />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/profile/:section" element={<Profile />} />
        <Route path="/results" element={<Results />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productForm" element={<ProductForm />} />
        <Route path="/cart/" element={<Cart />} />
        <Route path="/cart/:section" element={<Cart />} />
        <Route path="/buynow" element={<BuyNow />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/reset/:userId/:resetToken" element={<ResetPassword />} />
        <Route path="/orders/post-sale/:id" element={<PostSale />} />
        <Route path="/verify/:verifyToken" element={<VerifyEmail />} />
        <Route path="/details/:id" element={<Details />} />
        <Route element={<RequireRole allowedRoles={["admin", "superadmin"]} />}>
          <Route path="admin" element={<AdminLayout />}>
            {/* <Route index element={<Products />} /> */}
            <Route path="products" element={<Products />} />
            <Route path="productForm" element={<ProductForm />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="*" element={<h1>404 ADMIN</h1>} />
          </Route>
        </Route>
        <Route path="/unauthorized" element={<h1>UNAUTHORIZED</h1>} />
      </Routes>
    </div>
  );
}

export default App;
