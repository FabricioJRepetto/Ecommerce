import React from "react";
import LoaderBars from "../common/LoaderBars";
import Card from "../Products/Card";
import "./Wishlist.css";

const Wishlist = ({ loading, wishlist, wl_id }) => {
  return (
    <div>
      {!loading ? (
        <>
          <h1>Lista de deseados</h1>
          <div className="profile-wishlistcard-container">
            {wishlist?.length ? (
              React.Children.toArray(
                wishlist?.map((product) => (
                  <Card
                    productData={product}
                    fav={wl_id.includes(product._id)}
                  />
                ))
              )
            ) : (
              <p>Aún no has agregado productos a tu lista de deseados</p>
            )}
          </div>
        </>
      ) : (
        <LoaderBars />
      )}
    </div>
  );
};

export default Wishlist;
