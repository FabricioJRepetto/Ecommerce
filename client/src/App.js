import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
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

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");
    const loggedAvatar = window.localStorage.getItem("loggedAvatarEcommerce");
    const loggedEmail = window.localStorage.getItem("loggedEmailEcommerce");

    (async () => {
      try {
        if (loggedUserToken) {
          console.log("ENTRA");
          const { data } = await axios(`/user/profile/${loggedUserToken}`);
          console.log(data);
          dispatch(sessionActive(true));
          dispatch(loadUsername(data.name));
          dispatch(loadAvatar(data.avatar ? data.avatar : loggedAvatar));
          dispatch(loadEmail(data.email ? data.email : loggedEmail));
          dispatch(loadRole(data.role));

          const { data: cart } = await axios(`/cart`);
          dispatch(loadCart(cart.id_list));

          const { data: whish } = await axios(`/whishlist`);
          dispatch(loadWhishlist(whish.id_list));
        }
      } catch (error) {
        console.log(error);
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
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/reset/:userId/:resetToken" element={<ResetPassword />} />
        <Route path="/orders/post-sale/:id" element={<PostSale />} />
        <Route path="/verify/:verifyToken" element={<VerifyEmail />} />
        <Route path="/details/:id" element={<Details />} />
        <Route element={<RequireRole allowedRoles={["admin", "superadmin"]} />}>
          <Route path="admin" element={<AdminLayout />}>
            {/* <Route index element={<Products />} /> */}
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="*" element={<h1>404 ADMIN</h1>} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
