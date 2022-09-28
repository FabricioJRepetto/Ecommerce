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
import Products from "./components/Products/Products";
import ProviderStore from "./components/Provider/ProviderStore";
import ProviderPremium from "./components/Provider/ProviderPremium";
import ProductForm from "./components/Admin/ProductForm";
import Details from "./components/Products/Details";
import Results from "./components/Products/Results";
import AdminLayout from "./components/Admin/AdminLayout";
import OrdersAdmin from "./components/Admin/OrdersAdmin";
import Metrics from "./components/Admin/Metrics";
import SalesResults from "./components/Products/SalesResults";

import BackToTop from "./helpers/backToTop/BackToTop";
import RequireRole from "./components/Admin/RequireRole";
import UsersAdmin from "./components/Admin/UsersAdmin";
import AboutUs from "./components/common/AboutUs";
import Footer from "./components/common/Footer";
import LoaderBars from "./components/common/LoaderBars";
import PremiumDetails from "./components/Provider/PremiumDetails";
import { useUserLogin } from "./hooks/useUserLogin";

import axios from "axios";
import { useNotification } from "./hooks/useNotification";
import { useSignout } from "./hooks/useSignout";
import NotFound from "./components/common/NotFound";
import Unauthorized from "./components/common/Unauthorized";
import { useLocation } from "react-router-dom";
import FAQ from "./components/common/FAQ";

function App() {
    const dispatch = useDispatch();
    const { userLogin } = useUserLogin();
    const { pathname } = useLocation();
    const notification = useNotification();
    const signOut = useSignout();
    const isUserDataLoading = useSelector(
        (state) => state.sessionReducer.isUserDataLoading
    );


    //? Intercepta las respuestas de "token vencido" y cierra sesión
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.response?.data?.expiredToken) {
                console.warn("Por favor vuelve a iniciar sesión");
                notification("Por favor vuelve a iniciar sesión", "/signin", "error");
                signOut();
            }
            return Promise.reject(error);
        }
    );

    //? Evitar que el scroll quede desubicado al cambiar de página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    //? Inicia sesión automaticamente si hay un token valido en el localStorage
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
                <div className="app-components-container">
                    <GlobalCover />
                    <NavBar />
                    <BackToTop />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/buynow" element={<BuyNow />} />
                        <Route path="/cart/" element={<Cart />} />
                        <Route path="/cart/:section" element={<Cart />} />
                        <Route path="/details/:id" element={<Details />} />
                        <Route path="/faqs" element={<FAQ />} />
                        <Route path="/faqs/:question" element={<FAQ />} />
                        <Route path="/orders/post-sale" element={<PostSale />} />
                        <Route path="/premium" element={<ProviderPremium />} />
                        <Route path="/premium/:id" element={<PremiumDetails />} />
                        <Route path="/create" element={<ProductForm />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/provider" element={<ProviderStore />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:section" element={<Profile />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/sales" element={<SalesResults />} />
                        <Route path="/signin" element={<Signupin />} />
                        <Route path="/signin/:section" element={<Signupin />} />
                        <Route path="*" element={<NotFound />} />
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
                                <Route path="create" element={<ProductForm />} />
                                <Route path="users" element={<UsersAdmin />} />
                                <Route path="users/:id" element={<UsersAdmin />} />
                                <Route path="orders" element={<OrdersAdmin />} />
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Route>
                        <Route path="/unauthorized" element={<Unauthorized />} />
                    </Routes>
                    <Footer />
                </div>
            )}
        </div>
    );
}

export default App;
