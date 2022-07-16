import React from "react";
import { ReactComponent as Fav } from "../../assets/svg/fav.svg";
import axios from "axios";
import { loadWishlist } from "../../Redux/reducer/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "../../hooks/useNotification";
import "./WishlistButton.css";

export const WishlistButton = ({ prodId: id, size = 30, fav, visible }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.cartReducer.wishlist);
  const { session } = useSelector((state) => state.sessionReducer);
  const [notification] = useNotification();

  const addToWish = async (id) => {
    if (session) {
      if (!wishlist.includes(id)) {
        const { data } = await axios.post(`/wishlist/${id}`);
        console.log(data);
        dispatch(loadWishlist(data.list?.products));
        notification(data.message, "/profile/wishlist", "success");
      } else {
        const { data } = await axios.delete(`/wishlist/${id}`);
        console.log(data);
        dispatch(loadWishlist(data.list?.products));
        notification(data.message, "", "warning");
      }
    } else {
      notification(
        "Log in to add products to your wishlist.",
        "/signin",
        "warning"
      );
    }
  };

  return (
    <div className={`fav-button-container ${(fav || visible) && "visible"}`}>
      <button
        style={{ height: size, width: size }}
        onClick={() => addToWish(id)}
      >
        <Fav
          className={`fav-button-svg ${fav && "faved"}`}
          style={{ transform: "scale(.6)" }}
        />
      </button>
    </div>
  );
};
