import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { loadingUserData } from "./Redux/reducer/sessionSlice";
import "./App.css";

import GlobalCover from "../src/components/common/GlobalCover";

import Home from "./components/Home/Home";
import NotificationMaster from "./components/common/NotificationMaster";
import NavBar from "./components/NavBar/NavBar";
import Signupin from "./components/Session/Signupin";
import ResetPassword from "./components/Session/ResetPassword";
import VerifyEmail from "./components/Session/VerifyEmail";
import Profile from "./components/Profile/Profile";
import Cart from "./components/Cart/Cart";
import BuyNow from "./components/Cart/BuyNow";
import PostSale from "./components/Cart/PostSale";
import Products from "./test/fer/Products";
import ProviderStore from "./components/Provider/ProviderStore";
import ProviderPremium from "./components/Provider/ProviderPremium";
import ProductForm from "./test/fer/ProductForm";
import Details from "./components/Products/Details";
import Results from "./components/Products/Results";
import AdminLayout from "./test/fer/AdminLayout";
import OrdersAdmin from "./test/fer/OrdersAdmin";
import Metrics from "./test/fer/Metrics";
import SalesResults from "./components/Products/SalesResults";

import BackToTop from "./helpers/backToTop/BackToTop";
import RequireRole from "./test/fer/RequireRole";
import UsersAdmin from "./test/fer/UsersAdmin";
import AboutUs from "./components/common/AboutUs";
import LoaderBars from "./components/common/LoaderBars";
import ForgotPassword from "./components/Session/ForgotPassword";
import PremiumDetails from "./components/Provider/PremiumDetails";
import { useUserLogin } from "./hooks/useUserLogin";

function App() {
    const dispatch = useDispatch();
    const { userLogin } = useUserLogin();
    const isUserDataLoading = useSelector(
        (state) => state.sessionReducer.isUserDataLoading
    );

    useEffect(() => {
        if (window.localStorage.getItem("loggedTokenEcommerce")) {
            userLogin(window.localStorage.getItem("loggedTokenEcommerce"), false);
        } else {
            dispatch(loadingUserData(false));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="App" id="scroller">
            <NotificationMaster />
            {isUserDataLoading ? (
                <div className="g-container-totalvh">
                    <LoaderBars />
                </div>
            ) : (
                <div>
                    <GlobalCover />
                    <NavBar />
                    <BackToTop />
                    <Routes>
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/buynow" element={<BuyNow />} />
                        <Route path="/cart/" element={<Cart />} />
                        <Route path="/cart/:section" element={<Cart />} />
                        <Route path="/details/:id" element={<Details />} />
                        <Route path="/orders/post-sale" element={<PostSale />} />
                        <Route path="/premium" element={<ProviderPremium />} />
                        <Route path="/premium/:id" element={<PremiumDetails />} />
                        <Route path="/productForm" element={<ProductForm />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/provider" element={<ProviderStore />} />
                        <Route path="/profile/" element={<Profile />} />
                        <Route path="/profile/:section" element={<Profile />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/sales" element={<SalesResults />} />
                        <Route path="/signin" element={<Signupin />} />
                        <Route path="/forgotPassword" element={<ForgotPassword />} />
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<h1>404 USER</h1>} />{" "}
                        <Route
                            path="/reset/:userId/:resetToken"
                            element={<ResetPassword />}
                        />
                        <Route path="/verify/:verifyToken" element={<VerifyEmail />} />
                        <Route
                            element={<RequireRole allowedRoles={["admin", "superadmin"]} />}
                        >
                            <Route path="admin" element={<AdminLayout />}>
                                <Route index element={<Metrics />} />
                                <Route path="metrics" element={<Metrics />} />
                                <Route path="products" element={<Products />} />
                                <Route path="productForm" element={<ProductForm />} />
                                <Route path="users" element={<UsersAdmin />} />
                                <Route path="users/:id" element={<UsersAdmin />} />
                                <Route path="orders" element={<OrdersAdmin />} />
                                <Route path="*" element={<h1>404 ADMIN</h1>} />{" "}
                                {/* //! VOLVER A VER darle estilos al 404 */}
                            </Route>
                        </Route>
                        <Route path="/unauthorized" element={<h1>UNAUTHORIZED</h1>} />
                    </Routes>
                </div>
            )}
        </div>
    )
}

export default App;
