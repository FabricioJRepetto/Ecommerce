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
  const [waitingResponse, setWaitingResponse] = useState(false);
  const dispatch = useDispatch();
  const notification = useNotification();

  const deleteProduct = async () => {
    setWaitingResponse(true);
    try {
      const { data } = await axios.delete(`/product/${productToDelete.prodId}`);
      //dispatch(deleteProductFromState(productToDelete.prodId));
      dispatch(changeReloadFlag(true));
      notification(data.message, "", data.type);
    } catch (error) {
      console.log(error);
      notification("Algo anduvo mal", "", "warn");
      //! VOLVER A VER manejo de errores
    } finally {
      setWaitingResponse(false);
    }
  };
  const handleDeleteProduct = () => {
    deleteProduct();
    closeDeleteProduct();
  };

  const reactivateProduct = async () => {
    setWaitingResponse(true);
    try {
      const { data } = await axios.post(
        `/product/${productToReactivate.prodId}`
      );
      //dispatch(deleteProductFromState(productToReactivate.prodId));
      dispatch(changeReloadFlag(true));
      notification(data.message, "", data.type);
    } catch (error) {
      console.log(error);
      notification("Algo anduvo mal", "", "warn");
      //! VOLVER A VER manejo de errores
    } finally {
      setWaitingResponse(false);
    }
  };
  const handleReactivateProduct = () => {
    reactivateProduct();
    closeReactivateProduct();
  };

  const addDiscount = async () => {
    setWaitingResponse(true);
    try {
      const { data } = await axios.put(
        `/product/discount/${productToDiscount.prodId}`,
        discount
      );
      closeDiscountProduct();
      dispatch(changeReloadFlag(true));
      notification(data.message, "", data.type);
    } catch (error) {
      console.log(error);
      notification("Algo anduvo mal", "", "warn");
      //! VOLVER A VER manejo de errores
    } finally {
      setWaitingResponse(false);
    }
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

  const removeDiscount = async () => {
    setWaitingResponse(true);
    try {
      const { data } = await axios.delete(
        `/product/discount/${productToDiscount.prodId}`
      );
      closeDiscountProduct();
      dispatch(changeReloadFlag(true));
      notification(data.message, "", data.type);
    } catch (error) {
      console.log(error);
      notification("Algo anduvo mal", "", "warn");
      //! VOLVER A VER manejo de errores
    } finally {
      setWaitingResponse(false);
    }
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
              disabled={waitingResponse}
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closeDeleteProduct}
              className="g-white-button secondary-button"
              disabled={waitingResponse}
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
          {productToReactivate && productToReactivate.available_quantity ? (
            <>
              <p>{`¿Reactivar la publicación ${
                productToReactivate ? productToReactivate.name : null
              }?`}</p>

              <div>
                <button
                  type="button"
                  onClick={handleReactivateProduct}
                  className="g-white-button"
                  disabled={waitingResponse}
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  onClick={closeReactivateProduct}
                  className="g-white-button secondary-button"
                  disabled={waitingResponse}
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <p>Debes reponer stock para poder reactivar la publicación</p>
          )}
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
                disabled={waitingResponse}
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
                disabled={waitingResponse}
              >
                Aceptar
              </button>
            )}
            <button
              type="button"
              onClick={closeDiscountProduct}
              className="g-white-button secondary-button details-button"
              disabled={waitingResponse}
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
