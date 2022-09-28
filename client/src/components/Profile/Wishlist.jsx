import React from "react";
import LoaderBars from "../common/LoaderBars";
import WishlistCard from "./WishlistCard";
import "./Wishlist.css";

const Wishlist = ({ loading, wishlist, wl_id }) => {
  return (
    <>
      {!loading ? (
        <div className="profile-wishlist-container component-fadeIn">
          <h1>Favoritos</h1>
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
              <p>Aún no has agregado productos a Favoritos</p>
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
