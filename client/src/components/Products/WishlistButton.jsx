import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loadWishlist } from "../../Redux/reducer/cartSlice";
import { useNotification } from "../../hooks/useNotification";

import { DeleteIcon } from "@chakra-ui/icons";
import { ReactComponent as Heart } from "../../assets/svg/fav.svg";
import { ReactComponent as BrokenHeart } from "../../assets/svg/unfav.svg";

import "./WishlistButton.css";

export const WishlistButton = ({
  prodId: id,
  size = 30,
  fav,
  position = true,
  modal = false,
}) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cartReducer);
  const { session } = useSelector((state) => state.sessionReducer);
  const [disabled, setDisabled] = useState(false)
  const notification = useNotification();

  const addToWish = async (e, id) => {
    e.stopPropagation();
    setDisabled(true);
    
    if (session) {
      if (!wishlist.includes(id)) {
        const { data } = await axios.post(`/wishlist/${id}`);
        dispatch(loadWishlist(data.list?.products));
        notification(
          "Producto agregado a la lista de deseados",
          "/profile/wishlist",
          "success"
        );
      } else {
        const { data } = await axios.delete(`/wishlist/${id}`);
        dispatch(loadWishlist(data.list?.products));
        notification(
          "Producto eliminado de la lista de deseados",
          "",
          "warning"
        );
      }
    } else {
      notification(
        "Inicia sesión para agregar productos a la lista de deseados",
        "/signin",
        "warning"
      );
    };
    setTimeout(() => {
        setDisabled(false);
    }, 2000);
  };

  return (
    <div
      className={`visible fav-button-container${
        position ? " fav-button-position" : ""
      }`}
    >
      <button
        disabled={disabled}
        style={{ height: size, width: size }}
        onClick={(e) => addToWish(e, id)}
      >
        {!modal && (
          <>
            <Heart
              className={`heart-svg ${
                fav ? "heart-svg-faved" : "heart-svg-no-faved"
              }`}
            />
            <BrokenHeart
              className={`${
                fav ? "brokenheart-svg" : "brokenheart-svg-no-faved"
              }`}
            />
          </>
        )}
        {modal && <DeleteIcon color="#ffffff" />}
      </button>
    </div>
  );
};
