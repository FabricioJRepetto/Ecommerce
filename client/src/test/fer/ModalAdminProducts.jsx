import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import Modal from "../../components/common/Modal";
import {
  changeReloadFlag,
  deleteProductFromState,
} from "../../Redux/reducer/productsSlice";
import { useNotification } from "../../hooks/useNotification";

const ModalAdminProducts = ({
  isOpenDeleteProduct,
  closeDeleteProduct,
  productToDelete,
  isOpenDiscountProduct,
  closeDiscountProduct,
  productToDiscount,
  isOpenRemoveDiscount,
  closeRemoveDiscount,
  productToRemoveDiscount,
}) => {
  const [discount, setDiscount] = useState({ type: "", number: "" });
  const [priceOff, setPriceOff] = useState("");
  const dispatch = useDispatch();
  const [notification] = useNotification();

  const deleteProduct = () => {
    axios
      .delete(`/admin/product/${productToDelete.prodId}`)
      .then((r) => {
        r.type === 'success' && dispatch(deleteProductFromState(productToDelete.prodId));
        console.log(r);
        notification(r.data.message, "", r.data.type);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  };

  const handleDeleteProduct = () => {
    deleteProduct();
    closeDeleteProduct();
  };

  const addDiscount = () => {
    axios
      .put(`/admin/product/discount/${productToDiscount.prodId}`, discount)
      .then((_) => {
        closeDiscountProduct();
        dispatch(changeReloadFlag(true));
        notification("Descuento aplicado exitosamente", "", "success");
      })
      .catch((error) => console.log(error)); //! VOLVER A VER manejo de errores
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
      .delete(`/admin/product/discount/${productToRemoveDiscount.prodId}`)
      .then((_) => {
        closeRemoveDiscount();
        dispatch(changeReloadFlag(true));
        notification("Descuento removido exitosamente", "", "success");
      })
      .catch((error) => console.log(error)); //! VOLVER A VER manejo de errores
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
        <p>{`¿Eliminar el producto ${
          productToDelete ? productToDelete.name : null
        }?`}</p>
        <button type="button" onClick={handleDeleteProduct}>
          Aceptar
        </button>
        <button type="button" onClick={closeDeleteProduct}>
          Cancelar
        </button>
      </Modal>
      <Modal
        isOpen={isOpenDiscountProduct}
        closeModal={closeDiscountProduct}
        type="warn"
      >
        <p>{`Aplicar descuento a ${
          productToDiscount && productToDiscount.name
        }`}</p>
        <p>
          Precio de lista: ${`${productToDiscount && productToDiscount.price}`}
        </p>
        <label>
          <input
            type="radio"
            value="percent"
            name="discount_type"
            checked={discount.type === "percent"}
            onChange={handleRadio}
          />
          Porcentaje
        </label>
        <label>
          <input
            type="radio"
            value="fixed"
            name="discount_type"
            checked={discount.type === "fixed"}
            onChange={handleRadio}
          />
          Fijo
        </label>
        {discount.type && (
          <>
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
            {priceOff && (
              <>
                <p>Precio final: ${`${priceOff}`}</p>
                <button type="button" onClick={addDiscount}>
                  Aceptar
                </button>
              </>
            )}
          </>
        )}
        <button type="button" onClick={closeDiscountProduct}>
          Cancelar
        </button>
      </Modal>
      <Modal
        isOpen={isOpenRemoveDiscount}
        closeModal={closeRemoveDiscount}
        type="warn"
      >
        <p>{`¿Remover descuento de ${
          productToRemoveDiscount ? productToRemoveDiscount.name : null
        }?`}</p>
        <button type="button" onClick={removeDiscount}>
          Aceptar
        </button>
        <button type="button" onClick={closeRemoveDiscount}>
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default ModalAdminProducts;
