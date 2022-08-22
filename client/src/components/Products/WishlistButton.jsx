import React from "react";
import axios from "axios";
import { loadWishlist } from "../../Redux/reducer/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "../../hooks/useNotification";
import "./WishlistButton.css";

import { DeleteIcon, StarIcon } from "@chakra-ui/icons";

export const WishlistButton = ({ prodId: id, size = 30, fav, visible, position = true, modal = false }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cartReducer);
  const { session } = useSelector((state) => state.sessionReducer);
  const [notification] = useNotification();

  const addToWish = async (e,id) => {
    e.stopPropagation()
    if (session) {
      if (!wishlist.includes(id)) {
        const { data } = await axios.post(`/wishlist/${id}`);
        dispatch(loadWishlist(data.list?.products));
        notification('Producto agregado a favoritos.', "/profile/wishlist", "success");
      } else {
        const { data } = await axios.delete(`/wishlist/${id}`);
        dispatch(loadWishlist(data.list?.products));
        notification('Producto eliminado de favoritos.', "", "warning");
      }
    } else {
      notification(
        "Inicia sesión para agregar favoritos.",
        "/signin",
        "warning"
      );
    }
  };

  return (
    <div className={`fav-button-container ${(fav || visible) && "visible"}`} 
        style={position ? {position: 'absolute', top: '1rem', right: '1rem'} : {}}>
      <button style={{ height: size, width: size }}
        onClick={(e) => addToWish(e,id)}>            
            {!modal && <StarIcon color={fav ? '#ffd000' : '#7d7d7d'}/>}
            {modal && <DeleteIcon color='#ffffff'/>}        
      </button>
    </div>
  );
};
