import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import { priceFormat } from "../../helpers/priceFormat";
import { useNotification } from "../../hooks/useNotification";
import { ReactComponent as Arrow } from "../../assets/svg/arrow-right.svg";
import { ReactComponent as Pin } from "../../assets/svg/location.svg";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import Checkbox from "../common/Checkbox";
import QuantityInput from "./QuantityInput";
import { useSelector } from "react-redux";
import LoaderBars from "../common/LoaderBars";
import { WarningIcon } from "@chakra-ui/icons";
import AddAddress from "../Profile/AddAddress";
import ReturnButton from "../common/ReturnButton";
import Carousel from "../Home/Carousel/Carousel";
import { resizer } from "../../helpers/resizer";
import CopiableText from "../common/CopiableText";
import { ReactComponent as ArrowRight } from "../../assets/svg/arrow-right2.svg";
import SelectAddress from "./SelectAddress";

import "./BuyNow.css";

const BuyNow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasPreviousState = location.key !== "default";
  const session = useSelector((state) => state.sessionReducer.session);
  const notification = useNotification();

  const [id, setId] = useState();
  const [product, setProduct] = useState();
  const [productImg, setProductImg] = useState(false);
  const [address, setAddress] = useState(null);
  const [flash_shipping, setflash_shipping] = useState(false);
  const [selectedAdd, setSelectedAdd] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isOpenAddForm, openAddForm, closeAddForm, prop] = useModal();
  const [isOpenAddList, openAddList, closeAddList] = useModal();
  const [isOpenPreCheckout, openPreCheckout, closePreCheckout] = useModal();
  const [isOpenCheckout, openCheckout, closeCheckout] = useModal();

  const SHIP_COST = 500;

  useEffect(() => {
    if (session) {
      getProd();
      getAddress();
    } else {
      if (hasPreviousState) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }

    return () => {
      axios.post(`/cart/`, { product_id: "" });
    };
    // eslint-disable-next-line
  }, []);

  const getProd = async () => {
    const { data } = await axios(`/cart/`);
    setId(data.buyNow);
    if (data.buyNow === "") {
      if (hasPreviousState) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } else {
      const { data: {product: p} } = await axios(`/product/${data.buyNow}`);      
      if (p) {
        let aux = [];
        for (const obj of p.images) {
          aux.push({ img: resizer(obj.imgURL, 450) });
        }
        setProductImg(aux);
        setProduct(p);
      }
    }
    setLoading(false);
  };

  const getAddress = async () => {
    const { data } = await axios("/address");
    if (data.address) {
        setAddress(data.address)
      if (!selectedAdd) {
        const def = data.address.find((e) => e.isDefault === true);
        setSelectedAdd(def);
      }
    }
    setLoading(false);
  };

  const handleSelect = (id) => {
    let aux = address.filter((e) => e._id.toString() === id.toString());
    setSelectedAdd(aux[0]);
    closeAddList();
  };

  const shippingMode = async (boolean) => {
    setflash_shipping(boolean);
    await axios.put("/cart/flash", { flash_shipping: boolean });
  };

  const goCheckout = async () => {
    setLoadingPayment("S");
    // crea la order
    const { data: orderId } = await axios.post(`/order/buyNow`, {
      ...selectedAdd,
      flash_shipping,
      quantity,
      product_id: id,
    });
    // crea session de stripe y redirige
    const { data } = await axios.post(`/stripe/${orderId}`);
    notification("Serás redirigido a la plataforma de pago", "", "warning");
    setTimeout(() => {
      window.location.replace(data.url);
    }, 3000);
    return null;
  };

  const openMP = async () => {
    setLoadingPayment("MP");
    // crea la order
    const { data: orderId } = await axios.post(`/order/buyNow`, {
      ...selectedAdd,
      flash_shipping,
      quantity,
      product_id: id,
    });
    // crea la preferencia para mp con la order y ridirige
    const { data } = await axios.get(`/mercadopago/${orderId}`);

    notification("Serás redirigido a la plataforma de pago", "", "warning");

    setTimeout(() => {
      window.location.replace(data.init_point);
    }, 3000);
    return null;

    //* abre el MODAL de MP con la id de la preferencia
    // loadMercadoPago(data.id,
    // setLoadingPayment);
  };

  const shippingCost = () => {
    let cost = 0;
    if (flash_shipping) {
      if (product.free_shipping) {
        cost = SHIP_COST / 2;
      } else {
        cost = SHIP_COST * 1.5;
      }
    } else {
      if (product.free_shipping) {
        cost = 0;
      } else {
        cost = SHIP_COST;
      }
    }
    return cost;
  };

  const deliverDate = (flash = false) => {
    if (flash) {
      return "mañana";
    }
    // 259200000 (3 dias) - 1080000 (3 horas)
    const today = new Date(Date.now() + 248400000).getDay();
    let days = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    return ` el ${days[today]}`;
  };

  return (
    <div className="buynow-container component-fadeIn">
      {product && !loading ? (
        <div className="buynow-inner">
          <span className="bn-return-container">
            <ReturnButton to={-1} />
          </span>
          <div className="buynow-product-details">
            <div className="buynow-product-inner">
              <div className="buynow-img-container">
                {productImg && (
                  <Carousel
                    images={productImg}
                    pausable={false}
                    interval={3000}
                    width={"100%"}
                    height={"80%"}
                  />
                )}
                <div className="card-image-back-style"></div>
              </div>
              <h2>{product.name}</h2>
            </div>
            <div className="bn-quantity-container">
              <QuantityInput
                prodId={product.id}
                price={product.on_sale ? product.sale_price : product.price}
                stock={product.available_quantity}
                bnMode
                loading={loadingPayment}
                setQ={setQuantity}
              />
            </div>
          </div>

          <div className="buynow-inner-lateral">
            <div className="buynow-total-container  ">
              <div className="buynow-shipping-container">
                {selectedAdd ? (
                  <div
                    onClick={openAddList}
                    className="cart-address-selector"
                    name={"address-container"}
                  >
                    <Pin className="address-icon" />
                    {selectedAdd.street_name +
                      " " +
                      selectedAdd.street_number +
                      ", " +
                      selectedAdd.city}
                    <Arrow className="arrow-address-selector" />
                  </div>
                ) : (
                  <div
                    onClick={() => openAddForm(true)}
                    className="cart-address-selector"
                  >
                    <b>
                      <u>Agrega una dirección para continuar la compra.</u>
                    </b>
                    <Arrow className="arrow-address-selector" />
                  </div>
                )}

                <div className="bn-shipping-mode-container">
                  <div
                    onClick={() => shippingMode(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="bn-shipping-mode-card">
                      <Checkbox
                        isChecked={flash_shipping}
                        extraStyles={{
                          border: true,
                          rounded: true,
                          innerBorder: true,
                          margin: "1rem",
                          size: "1.2",
                        }}
                      />
                      <div>
                        <p className="provider-text">Envío Flash</p>
                        <p>{`Llega mañana`}</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => shippingMode(false)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="bn-shipping-mode-card">
                      <Checkbox
                        isChecked={!flash_shipping}
                        extraStyles={{
                          border: true,
                          rounded: true,
                          innerBorder: true,
                          margin: "1rem",
                          size: "1.2",
                        }}
                      />
                      <div>
                        <p>Envío estándar</p>
                        <p>{`Llega ${deliverDate()}`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="buynow-sumary-section">
                <div className="buynow-total">
                  <p>Subtotal:</p>
                  <div>
                    {product.on_sale && (
                      <div className="buynow-price-discount">
                        <p className="green">-{product.discount}% </p>
                        <del className="grey">
                          {" "}
                          ${priceFormat(product.price).int}
                        </del>
                      </div>
                    )}
                    <div>
                      <h3>{`${quantity > 1 ? quantity + "x " : ""} $${
                        priceFormat(
                          product.on_sale ? product.sale_price : product.price
                        ).int
                      }`}</h3>
                      <p>
                        {
                          priceFormat(
                            product.on_sale ? product.sale_price : product.price
                          ).cents
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="buynow-total">
                  <p>Envío:</p>
                  <div>
                    {product.free_shipping && (
                      <del className="grey">${priceFormat(SHIP_COST).int}</del>
                    )}
                    {product.free_shipping && !flash_shipping ? (
                      <div className="cart-ship-total green">
                        <h3>¡Envío gratis!</h3>
                      </div>
                    ) : (
                      <div className="cart-shipping-cost-container">
                        {flash_shipping && (
                          <div className="ship-gradient"></div>
                        )}
                        <h3>${priceFormat(shippingCost()).int}</h3>
                        <p>{priceFormat(shippingCost()).cents}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="total-section-inner">
                  <h2>Total:</h2>
                  <div>
                    <h2>
                      $
                      {
                        priceFormat(
                          product.on_sale
                            ? quantity * product.sale_price
                            : quantity * product.price
                        ).int
                      }
                    </h2>
                    <p>
                      {
                        priceFormat(
                          product.on_sale
                            ? quantity * product.sale_price
                            : quantity * product.price
                        ).cents
                      }
                    </p>
                  </div>
                </div>

                <div className="cart-button-section">
                  <button
                    className="g-white-button details-button"
                    disabled={!product || !selectedAdd || loadingPayment}
                    onClick={openPreCheckout}
                  >
                    Pagar
                  </button>
                </div>
              </div>
            </div>

            {!selectedAdd && (
              <div className="cart-warning-message">
                <span onClick={() => openAddForm(true)}>
                  <WarningIcon style={{ margin: "0 .5rem 0 0" }} />
                  Necesitas especificar una dirección de envío antes de realizar
                  el pago.
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="buynow-loading">
          <LoaderBars />
        </div>
      )}

      <form
        id="checkout-container"
        method="GET"
        action={`/orders/post-sale/`}
      ></form>

      <Modal isOpen={isOpenAddForm} closeModal={closeAddForm}>
        <AddAddress
          prop={prop}
          setAddress={setAddress}
          closeAddForm={closeAddForm}
          setSelectedAdd={setSelectedAdd}
          getAddress={getAddress}
        />
      </Modal>

      <Modal isOpen={isOpenAddList} closeModal={closeAddList}>        
        <SelectAddress 
            address={address} 
            handleSelect={handleSelect}
            openAddForm={openAddForm}
            closeAddList={closeAddList}/>
      </Modal>

      <Modal isOpen={isOpenPreCheckout} closeModal={closePreCheckout}>
        <div>
          <p className="cart-warning-message">
            <WarningIcon /> A continuación se simulará un pago. Si es la primera vez que lo haces, lee esto antes. Es recomendable mantener esa ventana abierta para consultar los datos.
          </p>
          <button className="g-white-button details-button" >
            <Link to={`/faqs/4`} target="_blank" rel="noopener noreferrer">¿Cómo comprar?</Link>
          </button>

          <span onClick={() => {openCheckout(); closePreCheckout()}} 
            className='g-text-button continue-button'>
                Continuar 
                <ArrowRight /> 
                <div className="arrow-right-gradient"></div>
            </span>

        </div>
      </Modal>

      <Modal isOpen={isOpenCheckout} closeModal={closeCheckout}>
        <div className="cart-modal-checkouts">            

            <div>
                <div className="cart-modal-logo">
                    <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663894003/Stripe_Logo-2_otuyhn.png" alt="stripe logo" />
                </div>
                <div>
                    <ul>
                        <li>
                            Número de tarjeta:<br/>
                            <CopiableText text={'4242 4242 4242 4242'}/>
                        </li>
                        <li>
                            Fecha de expiración:<br/><b>Cualquier fecha mayor a la actual</b>
                        </li>
                        <li>
                            cvc:<br/>
                            <CopiableText text={'123'}/>
                        </li>
                        <li>
                            E-mail:<br/><b>Cualquiera</b>
                        </li>
                        <li>
                            Nombre:<br/><b>Cualquiera</b>
                        </li>
                    </ul>

                    <button
                        className="g-white-button"
                        disabled={!product || !selectedAdd || loadingPayment}
                        onClick={goCheckout}
                        >
                        {loadingPayment === "S" ? (
                            <Spinner className="cho-svg" />
                        ) : (
                            "Pagar con Stripe"
                        )}
                    </button>
                </div>
            </div>

            <div>                
                <div className='cart-modal-logo'>
                    <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663894003/Mercadopago_Logo-2_anidpy.png" alt="Mercadopago logo" />
                </div>
                <div>
                    <ul>
                        <li>
                            Número de tarjeta:<br/>
                            <CopiableText text={'5416 7526 0258 2580'}/>
                        </li>
                        <li>
                            Fecha de expiración:<br/>
                            <CopiableText text={'11/25'}/>
                        </li>
                        <li>
                            cvc:<br/>
                            <CopiableText text={'123'}/>
                        </li>
                        <li>
                            Nombre:<br/>
                            <CopiableText text={'APRO'}/>
                        </li>
                        <li>
                            dni:<br/>
                            <CopiableText text={'12345678'}/>
                        </li>
                        <li>
                            E-mail:<br/>
                            <b>Cualquier email argentino (importante)</b>
                        </li>
                    </ul>
                    
                    <button
                        className="g-white-button cart-checkout-modal-button-container"
                        disabled={!product || !selectedAdd || loadingPayment}
                        onClick={openMP}
                        >
                        {loadingPayment === "MP" ? (
                            <Spinner className="cho-svg" />
                        ) : (
                            "Pagar con MercadoPago"
                        )}
                    </button>
                </div>
            </div>
          
        </div>
      </Modal>
    </div>
  );
};

export default BuyNow;
