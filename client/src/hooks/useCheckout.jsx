import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { addCart } from "../Redux/reducer/cartSlice";
import { useNotification } from "./useNotification"


export const useCheckout = (id) => {
    const dispatch = useDispatch();
    const [notification] = useNotification();
    const navigate = useNavigate();

    const { session } = useSelector((state) => state.sessionReducer);
    const cart = useSelector((state) => state.cartReducer.onCart);

    const addToCart = async (id) => {
        if (session) {
            const { statusText, data } = await axios.post(`/cart/${id}`);
            statusText === "OK" && !cart.includes(id) && dispatch(addCart(id));
            notification(
                data.message,
                "/cart",
                `${statusText === "OK" ? "success" : "warning"}`
            );
        } else {
            notification("Necesitas iniciar sesión primero.", "/signin", "warning");
        }
    };

    const buyNow = async (id) => {
        if (session) {
            await axios.post(`/cart/`, { product_id: id });
            navigate("/buyNow");
        } else {
            notification("Necesitas iniciar sesión primero.", "/signin", "warning");
        }
    };

    return {
        addToCart,
        buyNow
        }
}