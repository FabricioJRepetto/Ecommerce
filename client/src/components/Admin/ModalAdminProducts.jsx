import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import Modal from "../../components/common/Modal";
import {
  changeReloadFlag,
  deleteProductFromState,
} from "../../Redux/reducer/productsSlice";
import Checkbox from "../common/Checkbox";
import { useNotification } from "../../hooks/useNotification";
import "./ModalAdminProducts.css";

const ModalAdminProducts = ({
  isOpenDeleteProduct,
  closeDeleteProduct,
  productToDelete,
  isOpenReactivateProduct,
  closeReactivateProduct,
  productToReactivate,
  isOpenDiscountProduct,
  closeDiscountProduct,
  productToDiscount,
}) => {
  const [discount, setDiscount] = useState({ type: "", number: "" });
  const [priceOff, setPriceOff] = useState("");
  const dispatch = useDispatch();
  const notification = useNotification();

  const deleteProduct = () => {
    console.log("productToDelete.prodId", productToDelete.prodId);
    axios
      .delete(`/product/${productToDelete.prodId}`)
      .then((r) => {
        //dispatch(deleteProductFromState(productToDelete.prodId));
        dispatch(changeReloadFlag(true));
        notification(r.data.message, "", r.data.type);
      })
      .catch((error) => {
        console.error(error);
        notification("Algo anduvo mal", "", "warn");
      }); //! VOLVER A VER manejo de errores
  };

  const handleDeleteProduct = () => {
    deleteProduct();
    closeDeleteProduct();
  };
  const reactivateProduct = () => {
    axios
      .post(`/product/${productToReactivate.prodId}`)
      .then((r) => {
        //dispatch(deleteProductFromState(productToReactivate.prodId));
        dispatch(changeReloadFlag(true));
        notification(r.data.message, "", r.data.type);
      })
      .catch((error) => {
        console.error(error);
        notification("Algo anduvo mal", "", "warn");
      }); //! VOLVER A VER manejo de errores
  };

  const handleReactivateProduct = () => {
    reactivateProduct();
    closeReactivateProduct();
  };

  const addDiscount = () => {
    axios
      .put(`/product/discount/${productToDiscount.prodId}`, discount)
      .then((_) => {
        closeDiscountProduct();
        dispatch(changeReloadFlag(true));
        notification("Descuento aplicado exitosamente", "", "success");
      })
      .catch((error) => {
        console.error(error);
        notification("Algo anduvo mal", "", "warn");
      }); //! VOLVER A VER manejo de errores
  };

  const handleAddDiscount = (e) => {
    const { value, validity } = e.target;

    let validatedValue;

    if (discount.type === "percent") {
      if (
        (validity.valid && value === "") ||
        (parseInt(value) > 0 && parseInt(value) < 100)
      ) {
        validatedValue = value;
      } else {
        validatedValue = discount.number;
      }
    } else {
      if (
        (validity.valid && value === "") ||
        parseInt(productToDiscount.price) > parseInt(value)
      ) {
        validatedValue = value;
      } else {
        validatedValue = discount.number;
      }
    }
    setDiscount({
      ...discount,
      number: validatedValue,
    });
  };

  const removeDiscount = () => {
    axios
      .delete(`/product/discount/${productToDiscount.prodId}`)
      .then((_) => {
        closeDiscountProduct();
        dispatch(changeReloadFlag(true));
        notification("Descuento removido exitosamente", "", "success");
      })
      .catch((error) => {
        console.error(error);
        notification("Algo anduvo mal", "", "warn");
      }); //! VOLVER A VER manejo de errores
  };

  const handleRadio = (e) => {
    setDiscount({
      ...discount,
      type: e.target.value,
    });
  };

  useEffect(() => {
    let discountApplied = "";
    if (discount.number) {
      if (discount.type === "percent") {
        discountApplied =
          productToDiscount.price -
          (parseInt(discount.number) * productToDiscount.price) / 100;
      } else {
        discountApplied = productToDiscount.price - parseInt(discount.number);
      }
    }
    setPriceOff(discountApplied); // eslint-disable-next-line
  }, [discount]);

  useEffect(() => {
    discount && discount.type && setDiscount({ ...discount, number: "" });
    // eslint-disable-next-line
  }, [discount.type]);

  return (
    <div>
      <Modal
        isOpen={isOpenDeleteProduct}
        closeModal={closeDeleteProduct}
        type="warn"
      >
        <div className="publications-modal-pause-resume">
          <p>{`¿Pausar la publicación ${
            productToDelete ? productToDelete.name : null
          }?`}</p>

          <div>
            <button
              type="button"
              onClick={handleDeleteProduct}
              className="g-white-button"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closeDeleteProduct}
              className="g-white-button secondary-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenReactivateProduct}
        closeModal={closeReactivateProduct}
        type="warn"
      >
        <div className="publications-modal-pause-resume">
          <p>{`¿Reactivar la publicación ${
            productToReactivate ? productToReactivate.name : null
          }?`}</p>

          <div>
            <button
              type="button"
              onClick={handleReactivateProduct}
              className="g-white-button"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closeReactivateProduct}
              className="g-white-button secondary-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOpenDiscountProduct}
        closeModal={closeDiscountProduct}
        type="warn"
      >
        <div className="modal-discount-container">
          <div className="modal-discount-header">
            <h2>{`Actualizar descuento de ${
              productToDiscount && productToDiscount.name
            }`}</h2>
            <h2>
              Precio de lista: $
              {`${productToDiscount && productToDiscount.price}`}
            </h2>
          </div>

          <div className="modal-discount-checks">
            <label className="form-shipping-input">
              <Checkbox
                isChecked={discount.type === "percent"}
                extraStyles={{
                  border: true,
                  rounded: true,
                  innerBorder: true,
                  margin: ".05rem",
                  size: "1.2",
                }}
              />
              <input
                type="radio"
                value="percent"
                name="discount_type"
                defaultChecked={discount.type === "percent"}
                onChange={handleRadio}
              />
              <span>Porcentaje</span>
            </label>
            <label className="form-shipping-input">
              <Checkbox
                isChecked={discount.type === "fixed"}
                extraStyles={{
                  border: true,
                  rounded: true,
                  innerBorder: true,
                  margin: ".05rem",
                  size: "1.2",
                }}
              />
              <input
                type="radio"
                value="fixed"
                name="discount_type"
                checked={discount.type === "fixed"}
                onChange={handleRadio}
              />
              <span>Fijo</span>
            </label>
          </div>

          {discount.type ? (
            <div className="modal-discount-input">
              <div>
                <span>
                  ${`${productToDiscount && productToDiscount.price}`} -{" "}
                </span>
                {discount.type === "percent" ? (
                  <span> % </span>
                ) : (
                  <span> $ </span>
                )}
                <input
                  type="text"
                  pattern="[0-9]*"
                  placeholder="Descuento"
                  value={discount.number}
                  onChange={handleAddDiscount}
                />
              </div>

              <div className="modal-discount-input-result">
                {priceOff && <h2>Precio final: ${`${priceOff}`}</h2>}
              </div>
            </div>
          ) : (
            <div className="modal-discount-placeholder"></div>
          )}

          {productToDiscount?.on_sale && (
            <div>
              <button
                type="button"
                onClick={removeDiscount}
                className="g-white-button"
              >
                Remover descuento
              </button>
            </div>
          )}

          <div>
            {discount.number && (
              <button
                type="button"
                onClick={addDiscount}
                className="g-white-button details-button"
              >
                Aceptar
              </button>
            )}
            <button
              type="button"
              onClick={closeDiscountProduct}
              className="g-white-button secondary-button details-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalAdminProducts;
