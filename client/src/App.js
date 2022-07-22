import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
    setGlobalLoading,
    loadAvatar,
    loadEmail,
    loadUsername,
    sessionActive,
    loadRole,
    loadGoogleUser,
    loadId,
    loadFullName,
} from "./Redux/reducer/sessionSlice";
import { loadCart, loadWishlist } from "./Redux/reducer/cartSlice";
import axios from "axios";
import "./App.css";

import GlobalCover from "../src/components/common/GlobalCover";

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
import PostSale from "./components/Cart/PostSale";
import Products from "./test/fer/Products";
import ProductForm from "./test/fer/ProductForm";
import Details from "./components/Products/Details";
import Results from "./components/Products/Results";
import AdminLayout from "./test/fer/AdminLayout";
import OrdersAdmin from "./test/fer/OrdersAdmin";
import Metrics from "./test/fer/Metrics";

import BackToTop from "./helpers/backToTop/BackToTop";
import RequireRole from "./test/fer/RequireRole";
import UsersAdmin from "./test/fer/UsersAdmin";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { session } = useSelector(state => state.sessionReducer);
    const { loading } = useSelector(state => state.sessionReducer);

    useEffect(() => {
        dispatch(setGlobalLoading(true));
        const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");

        (async () => {
            try {
                if (loggedUserToken) {
                    const { data } = await axios(`/user/profile/${loggedUserToken}`); //! VOLVER A VER fijarse con nuevos usuarios de google
                    // console.log(data);

                    const { _id, email, googleEmail, name, firstName, lastName, username, role, isGoogleUser, avatar } = data;

                    dispatch(sessionActive(true));
                    dispatch(loadUsername(username || name));
                    dispatch(loadFullName({
                        first: firstName || false,
                        last: lastName || false,
                    }))
                    dispatch(loadAvatar(avatar ? avatar : false));
                    dispatch(loadEmail(googleEmail || email));
                    dispatch(loadId(_id))
                    dispatch(loadRole(role));
                    dispatch(loadGoogleUser(isGoogleUser));

                    const { data: cart } = await axios(`/cart`);
                    dispatch(loadCart(cart.id_list || []));

                    const { data: wish } = await axios(`/wishlist`);
                    dispatch(loadWishlist(wish.id_list));
                }
                dispatch(setGlobalLoading(false));
            } catch (error) {
                navigate("/");
                window.localStorage.removeItem("loggedTokenEcommerce");
                window.localStorage.removeItem("loggedAvatarEcommerce");
                window.localStorage.removeItem("loggedEmailEcommerce");
                dispatch(setGlobalLoading(false));
            }
        })();
        // dispatch(setGlobalLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    return (
        <div className="App" id="scroller">
            {loading
                ? <div className="globalLoader"></div>
                : <div>
                    <GlobalCover />
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
                        <Route path="/reset/:userId/:resetToken" element={<ResetPassword />} />
                        <Route path="/orders/post-sale" element={<PostSale />} />
                        <Route path="/verify/:verifyToken" element={<VerifyEmail />} />
                        <Route path="/details/:id" element={<Details />} />
                        <Route element={<RequireRole allowedRoles={["admin", "superadmin"]} />}>
                            <Route path="admin" element={<AdminLayout />}>
                                <Route index element={<Metrics />} />
                                <Route path="metrics" element={<Metrics />} />
                                <Route path="products" element={<Products />} />
                                <Route path="productForm" element={<ProductForm />} />
                                <Route path="users" element={<UsersAdmin />} />
                                <Route path="users/:id" element={<UsersAdmin />} />
                                <Route path="orders" element={<OrdersAdmin />} />
                                <Route path="*" element={<h1>404 ADMIN</h1>} />
                            </Route>
                        </Route>
                        <Route path="/unauthorized" element={<h1>UNAUTHORIZED</h1>} />
                    </Routes>
                </div>}
        </div>
    );
}

export default App;
