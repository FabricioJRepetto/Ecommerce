import React from "react";
import LoaderBars from "../common/LoaderBars";
import { useModal } from "../../hooks/useModal";
import ModalAdminProducts from "../Admin/ModalAdminProducts";
import { useNavigate } from "react-router-dom";
import SaleMetrics from "./SaleMetrics/SaleMetrics";

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
    <div className="profile-publications-section">
      <div className="profile-publications-header">
        <h1>Publicaciones</h1>
        <button
          className="g-white-button"
          onClick={() => {
            navigate("/create");
          }}
        >
          Crear nueva publucación
        </button>
      </div>
      {!loading ? (
        <div className="profile-wishlist-container component-fadeIn">
          <div>
            {publications?.length ? (
              React.Children.toArray(
                publications?.map((p) => (
                  <SaleMetrics
                    props={p}
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
    </div>
  );
};

export default Publications;
