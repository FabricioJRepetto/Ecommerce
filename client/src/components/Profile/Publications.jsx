import React from "react";
import LoaderBars from "../common/LoaderBars";
import WishlistCard from "./WishlistCard";
import { useModal } from "../../hooks/useModal";
import ModalAdminProducts from "../Admin/ModalAdminProducts";

import "./Publications.css";

const Publications = ({ loading, publications }) => {
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
  const [
    isOpenRemoveDiscount,
    openRemoveDiscount,
    closeRemoveDiscount,
    productToRemoveDiscount,
  ] = useModal();

  return (
    <>
      {!loading ? (
        <div className="profile-wishlist-container">
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
                    openRemoveDiscount={openRemoveDiscount}
                  />
                ))
              )
            ) : (
              <p>Aún no has publicado ningún produco</p>
            )}
          </div>
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
        isOpenRemoveDiscount={isOpenRemoveDiscount}
        closeRemoveDiscount={closeRemoveDiscount}
        productToDelete={productToDelete}
        productToReactivate={productToReactivate}
        productToDiscount={productToDiscount}
        productToRemoveDiscount={productToRemoveDiscount}
      />
    </>
  );
};

export default Publications;
