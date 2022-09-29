import React from "react";
import LoaderBars from "../common/LoaderBars";
import WishlistCard from "./WishlistCard";
import { useModal } from "../../hooks/useModal";
import ModalAdminProducts from "../Admin/ModalAdminProducts";
import { useNavigate } from "react-router-dom";

import "./Publications.css";

const Publications = ({ loading, publications }) => {
  const navigate = useNavigate();
  const [
    isOpenDeleteProduct,
    openDeleteProduct,
    closeDeleteProduct,
    productToDelete,
  ] = useModal();
  const [
    isOpenReactivateProduct,
    openReactivateProduct,
    closeReactivateProduct,
    productToReactivate,
  ] = useModal();
  const [
    isOpenDiscountProduct,
    openDiscountProduct,
    closeDiscountProduct,
    productToDiscount,
  ] = useModal();

  return (
    <>
      {!loading ? (
        <div className="profile-wishlist-container component-fadeIn">
          <h1>Publicaciones</h1>
          <div>
            {publications?.length ? (
              React.Children.toArray(
                publications?.map(({ product }) => (
                  <WishlistCard
                    productData={product}
                    openDeleteProduct={openDeleteProduct}
                    openReactivateProduct={openReactivateProduct}
                    openDiscountProduct={openDiscountProduct}
                  />
                ))
              )
            ) : (
              <p>Aún no has publicado ningún produco</p>
            )}
          </div>
          <button
            className="g-white-button"
            onClick={() => {
              navigate("/create");
            }}
          >
            Publicar
          </button>
        </div>
      ) : (
        <LoaderBars />
      )}
      <ModalAdminProducts
        isOpenDeleteProduct={isOpenDeleteProduct}
        closeDeleteProduct={closeDeleteProduct}
        isOpenReactivateProduct={isOpenReactivateProduct}
        closeReactivateProduct={closeReactivateProduct}
        isOpenDiscountProduct={isOpenDiscountProduct}
        closeDiscountProduct={closeDiscountProduct}
        productToDelete={productToDelete}
        productToReactivate={productToReactivate}
        productToDiscount={productToDiscount}
      />
    </>
  );
};

export default Publications;
