import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCart } from "../Redux/reducer/cartSlice";
import { useNotification } from "./useNotification";

export const useCheckout = (id) => {
  const dispatch = useDispatch();
  const notification = useNotification();
  const navigate = useNavigate();

  const { session } = useSelector((state) => state.sessionReducer);
  const cart = useSelector((state) => state.cartReducer.onCart);

  const addToCart = async (id) => {
    if (session) {
      try {
        const { data } = await axios.post(`/cart/${id}`);
        console.log("data", data);

        data.ok && !cart.includes(id) && dispatch(addCart(id));
        notification(data.message, "/cart", "success");
      } catch (error) {
        console.log(error);
        notification("Hubo un problema", "/cart", "warning"); //! VOLVER A VER manejo de errores
      }
    } else {
      notification("Inicia sesión para comprar", "/signin", "warning");
    }
  };

  const buyNow = async (id) => {
    if (session) {
      try {
        await axios.post(`/cart/`, { product_id: id });
        navigate("/buyNow");
      } catch (error) {
        console.log(error); //! VOLVER A VER manejo de errores
      }
    } else {
      notification("Inicia sesión para comprar", "/signin", "warning");
    }
  };

  return {
    addToCart,
    buyNow,
  };
};
