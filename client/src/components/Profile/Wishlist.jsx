import React from "react";
import LoaderBars from "../common/LoaderBars";
import WishlistCard from "./WishlistCard";
import "./Wishlist.css";

const Wishlist = ({ loading, wishlist, wl_id }) => {
  return (
    <>
      {!loading ? (
        <div className="profile-wishlist-container">
          <h1>Lista de deseados</h1>
          <div>
            {wishlist?.length ? (
              React.Children.toArray(
                wishlist?.map((product) => (
                  <WishlistCard
                    productData={product}
                    fav={wl_id.includes(product._id)}
                  />
                ))
              )
            ) : (
              <p>Aún no has agregado productos a tu lista de deseados</p>
            )}
          </div>
        </div>
      ) : (
        <LoaderBars />
      )}
    </>
  );
};

export default Wishlist;
