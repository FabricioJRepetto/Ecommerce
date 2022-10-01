import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { cartTotal } from "../../Redux/reducer/cartSlice";
import {ReactComponent as Spinner} from '../../assets/svg/spinner.svg';

import "./QuantityInput.css";

const QuantityInput = (props) => {

    const {
        prodId: id,
        prodQuantity = 1,
        stock,
        price,
        bnMode = false,
        setQ,
        loading,
        on_cart
    } = props;

  const [quantity, setQuantity] = useState(stock > prodQuantity ? prodQuantity : stock);
  const [sendingData, setSendingData] = useState(false)
  const dispatch = useDispatch();

  const handleQuantity = async (id, mode) => {
    setSendingData(true)
    !bnMode && (await axios.put(`/cart/quantity/?id=${id}&mode=${mode}`));

    if (mode === "add") {
      //! dispatch del total
      bnMode ? setQ(quantity + 1) : dispatch(cartTotal({id, amount: ( quantity + 1 ) * price}));

      setQuantity(quantity + 1);
    } else {
      //! dispatch del total
      bnMode ? setQ(quantity - 1) : dispatch(cartTotal({id, amount: ( quantity - 1 ) * price}));

      setQuantity(quantity - 1);
    }
    setSendingData(false)
  };

  const handleQuantityEx = async ({ target }) => {
    setSendingData(true)

    const { name, value, validity } = target;
    let validatedValue;

    if (!validity.valid) {
      validatedValue = quantity[name];
    } else {
      validatedValue = value;
    }

    if (validatedValue < 1) {
      setQuantity(1);
      bnMode && setQ(1);
      validatedValue = 1;
      //! dispatch del total    
      !bnMode && dispatch(cartTotal({id, amount: price}));
    } else if (validatedValue > stock) {
      setQuantity(stock);
      bnMode && setQ(stock);
      validatedValue = stock;
      //! dispatch del total    
      !bnMode && dispatch(cartTotal({id, amount: stock * price}));
    } else {
      //! dispatch del total    
      !bnMode && dispatch(cartTotal({id, amount: validatedValue * price}));
      setQuantity(validatedValue);
      bnMode && setQ(validatedValue);

      !bnMode && (await axios.put(`/cart/quantityEx?id=${id}&amount=${validatedValue}`));
    }
    setSendingData(false)
  };

  return (
    <div className={`q-input-container ${on_cart && 'q-input-container-invisible'}`}>
      <div className="q-input-inner">
        {sendingData && <Spinner className='q-input-spinner'/>}
        <button
          disabled={quantity < 2 || loading || sendingData}
          onClick={() => handleQuantity(id, "sub")}
        >
          {" "}
          -{" "}
        </button>

        <input
          type="number"
          disabled={loading || sendingData}
          min={1}
          pattern="[1-9]"
          id={id}
          className={"quantityInput"}
          value={quantity}
          onChange={handleQuantityEx}
        />

        <button
          disabled={quantity >= stock || loading || sendingData}
          onClick={() => handleQuantity(id, "add")}
        >
          {" "}
          +{" "}
        </button>

      </div>

      <div className="q-input-stock">
        <p>{`${stock === 1 ? "Último disponible" : `${stock} disponibles`}`}</p>
      </div>

    </div>
  );
};

export default QuantityInput;
