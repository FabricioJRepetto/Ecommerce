import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { resizer } from "../../helpers/resizer";
import { priceFormat } from "../../helpers/priceFormat";
import {
  loadIdProductToEdit,
  deleteProductFromState,
} from "../../Redux/reducer/productsSlice";
import "./Card.css";

import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WhishlistButton as Fav } from "./WhishlistButton";
import { useNotification } from "../../hooks/useNotification";
import { useModal } from "../../hooks/useModal";

import Modal from "../common/Modal";

const Card = ({
  img,
  name,
  brand,
  price,
  on_sale,
  sale_price,
  discount,
  prodId,
  free_shipping,
  fav,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const { session } = useSelector((state) => state.sessionReducer);
  const dispatch = useDispatch();
  const [notification] = useNotification();
  const [isOpenDeleteProduct, openDeleteProduct, closeDeleteProduct] =
    useModal();

  const editProduct = (prodId) => {
    dispatch(loadIdProductToEdit(prodId));
    navigate("/productForm");
  };

  const handleDeleteProduct = () => {
    deleteProduct(prodId);
    closeDeleteProduct();
  };

  const deleteProduct = (prodId) => {
    axios
      .delete(`/product/${prodId}`)
      .then((_) => {
        dispatch(deleteProductFromState(prodId));
        notification("Producto eliminado exitosamente", "", "success");
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  };

  const saleProduct = (prodId) => {};

  return (
    <div
      key={prodId}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="product-card"
    >
      {session && <Fav visible={visible} fav={fav} prodId={prodId} />}

      <div className="card-main-container">
        <div
          onClick={() => navigate(`/details/${prodId}`)}
          className="card-img-container pointer"
        >
          <img src={resizer(img, 180)} alt="product" />
        </div>

        <div className="card-details-container">
          <div>{brand && brand.toUpperCase()}</div>

          <h2
            className="card-name pointer c-mrgn"
            onClick={() => navigate(`/details/${prodId}`)}
          >
            {name}
          </h2>

          <div className="card-price-container c-mrgn">
            <div className="card-original-price">
              {on_sale && <del>{"$" + priceFormat(price).int}</del>}
            </div>
            <div className="card-price-section">
              <div className="minicard-price-section-inner">
                <h2>{"$" + priceFormat(on_sale ? sale_price : price).int}</h2>
                <p>{priceFormat(on_sale ? sale_price : price)?.cents}</p>
              </div>

              {on_sale && (
                <div className="minicard-sale-section">
                  <Sale className="onsale-svg" />
                  <p>{`${discount}% off`}</p>
                </div>
              )}
            </div>
          </div>

          <div className="free-shipping c-mrgn">
            {free_shipping && "envío gratis"}
          </div>
          {location.pathname === "/admin/products" && (
            <>
              <button type="button" onClick={() => editProduct(prodId)}>
                EDITAR
              </button>
              <button type="button" onClick={() => openDeleteProduct(prodId)}>
                ELIMINAR
              </button>
              <button type="button" onClick={() => saleProduct(prodId)}>
                DESCUENTO {/* //! VOLVER A VER agregar funcion para dto */}
              </button>
            </>
          )}
        </div>
      </div>
      <Modal
        isOpen={isOpenDeleteProduct}
        closeModal={closeDeleteProduct}
        type="warn"
      >
        <p>{`¿Eliminar ${name}?`}</p>
        <button type="button" onClick={() => handleDeleteProduct()}>
          Aceptar
        </button>
        <button type="button" onClick={closeDeleteProduct}>
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default Card;
