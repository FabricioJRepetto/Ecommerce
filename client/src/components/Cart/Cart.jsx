import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CartCard from "../Products/CartCard";
import Footer from "../common/Footer";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../hooks/useNotification";
import { cartTotal, loadCart } from "../../Redux/reducer/cartSlice";
// import { loadMercadoPago } from "../../helpers/loadMP";
import { priceFormat } from "../../helpers/priceFormat";
import "./Cart.css";

import { ReactComponent as Arrow } from "../../assets/svg/arrow-right.svg";
import { ReactComponent as Pin } from "../../assets/svg/location.svg";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import LoaderBars from "../common/LoaderBars";
import Checkbox from "../common/Checkbox";
import { WarningIcon } from "@chakra-ui/icons";
import AddAddress from "../Profile/AddAddress";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notification] = useNotification();
  const { section } = useParams();

  const [render, setRender] = useState(section);
  const [cart, setCart] = useState(false);
  const [flash_shipping, setflash_shipping] = useState(false);
  const [orderId, setOrderId] = useState(false);
  const [address, setAddress] = useState(null);
  const [selectedAdd, setSelectedAdd] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const { total } = useSelector((state) => state.cartReducer);

  const [isOpenAddForm, openAddForm, closeAddForm, prop] = useModal();
  const [isOpenAddList, openAddList, closeAddList] = useModal();
  const [isOpenCheckout, openCheckout, closeCheckout] = useModal();

  const SHIP_COST = 500;

  useEffect(() => {
    (async () => {
      await getCart();
      await getAddress();
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    })();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setRender(section || "cart");
  }, [section]);

  const getCart = async () => {
    const { data } = await axios("/cart/");
    if (data) {
      setCart(data);
      setflash_shipping(data.flash_shipping || false);
      data.last_order?.length && setOrderId(data.last_order);
      data.message && notification(data.message, "", "warning");
      dispatch(cartTotal(data.total));
      dispatch(loadCart(data.id_list));
    }
  };

  const getAddress = async () => {
    const { data } = await axios("/address");
    if (data.address) {
      setAddress(data.address);
      if (!selectedAdd) {
        const def = data.address.find((e) => e.isDefault);
        setSelectedAdd(def);
      }
    }
  };

  const handleSelect = (id) => {
    let aux = address.filter((e) => e._id.toString() === id.toString());
    setSelectedAdd(aux[0]);
    closeAddList();
  };

  const deleteProduct = async (id, source) => {
    await axios.delete(`/cart?id=${id}&source=${source}`);
    getCart();
    notification("Producto eliminado del carrito.", "", "warning");
  };

  const buyLater = async (id) => {
    const { data } = await axios.post(`/cart/buylater/${id}`);
    getCart();
    notification(data.message, "", "");
  };

  const shippingMode = async (boolean) => {
    setflash_shipping(boolean);
    const { data } = await axios.put("/cart/flash", {
      flash_shipping: boolean,
    });
    setCart(data.cart);
    console.log(data.cart);
  };

  const goCheckout = async () => {
    setLoadingPayment("S");
    let fastId = false;
    // actualiza o crea la order
    if (orderId) {
      await axios.put(`/order/${orderId}`, { ...selectedAdd, flash_shipping });
    } else {
      const { data: id } = await axios.post(`/order/`, selectedAdd);
      fastId = id;
      setOrderId(id);
      await axios.put(`/cart/order?id=${id}`);
    }

    //? crea session de stripe y redirige
    const { data } = await axios.post(`/stripe/${orderId || fastId}`);
    notification("Serás redirigido a la plataforma de pago", "", "warning");
    setTimeout(() => {
      window.location.replace(data.url);
    }, 3000);
    return null;
  };

  const openMP = async () => {
    setLoadingPayment("MP");
    let fastId = false;
    // actualiza o crea la order
    if (orderId) {
      await axios.put(`/order/${orderId}`, { ...selectedAdd, flash_shipping });
    } else {
      const { data: id } = await axios.post(`/order/`, selectedAdd);
      fastId = id;
      setOrderId(id);
      await axios.put(`/cart/order?id=${id}`);
    }

    //? crea la preferencia para mp con la order y redirige
    const { data } = await axios.get(`/mercadopago/${orderId || fastId}`);
    notification("Serás redirigido a la plataforma de pago", "", "warning");
    setTimeout(() => {
      window.location.replace(data.init_point);
    }, 3000);
    return null;

    //* abre el modal de mp con la id de la preferencia
    // loadMercadoPago(data.id,
    // setLoadingPayment());
  };

  const buyNow = async (id) => {
    await axios.post(`/cart/`, { product_id: id });
    //: delete
    navigate("/buyNow");
  };

  const deliverDate = () => {
    // hasta las 15 de mañana + 172800000 (2 dias)
    let now = new Date(Date.now() - 10800000);
    let hours = 24 - now.getHours() + 15;
    const target = new Date(Date.now() + hours * 3600000 + 172800000).getDay();
    let days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return ` el ${days[target]}`;
  };

  return (
    <div>
      <div className="cart-container">
        <div className="tab-button-container" style={{ width: "70vw" }}>
          {
            <button
              onClick={() => navigate("/cart/")}
              className={`tab-button ${
                render === "cart" ? "tab-button-active" : ""
              }`}
            >
              {`Carrito ${
                cart.products?.length ? `(${cart?.products?.length})` : ""
              }`}
            </button>
          }

          {
            <button
              onClick={() => navigate("/cart/saved")}
              className={`tab-button ${
                !(render === "cart") ? "tab-button-active" : ""
              }`}
            >
              {`Guardados ${
                cart.buyLater?.length ? `(${cart?.buyLater?.length})` : ""
              }`}
            </button>
          }
        </div>

        <div>
          {loading && (!cart || cart.products?.length < 1) ? (
            <div className="cart-loading-placeholder">
              {loading && <LoaderBars />}
            </div>
          ) : (
            <div>
              {render === "cart" ? (
                <div className="cart-inner">
                  {!cart.products || cart.products?.length < 1 ? (
                    <h2>Tu carrito está vacío</h2>
                  ) : (
                    <div>
                      <div>
                        {cart.products.map((p) => (
                          <CartCard
                            key={p._id}
                            premium={p.premium}
                            on_cart={true}
                            on_sale={p.on_sale}
                            img={p.thumbnail}
                            name={p.name}
                            prodId={p._id}
                            price={p.price}
                            sale_price={p.sale_price}
                            free_shipping={p.free_shipping}
                            discount={p.discount}
                            brand={p.brand}
                            prodQuantity={p.quantity}
                            stock={p.stock}
                            buyLater={buyLater}
                            deleteP={deleteProduct}
                            buyNow={buyNow}
                            source={"products"}
                            loading={loadingPayment}
                          />
                        ))}
                      </div>

                      <div className="total-section-container">
                        <div className="cart-shipping-container">
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
                                <u>
                                  Agrega una dirección para continuar la compra.
                                </u>
                              </b>
                              <Arrow className="arrow-address-selector" />
                            </div>
                          )}

                          <div className="cart-shipping-mode-container">
                            <div
                              onClick={() => shippingMode(true)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="cart-shipping-mode-card">
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
                                  <p>{`llega mañana`}</p>
                                </div>
                              </div>
                            </div>

                            <div
                              onClick={() => shippingMode(false)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="cart-shipping-mode-card">
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
                                  <p>{`llega ${deliverDate()}`}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="cart-sumary-section">
                          <div className="cart-total">
                            <p>subtotal:</p>
                            <div>
                              <h3>${priceFormat(total).int}</h3>
                              <p>{priceFormat(total).cents}</p>
                            </div>
                          </div>

                          <div className="cart-total">
                            <p>envío:</p>
                            <div style={{ height: "2.4rem" }}>
                              {cart.free_ship_cart && (
                                <del className="grey">
                                  $
                                  {
                                    priceFormat(
                                      cart.products.length * SHIP_COST
                                    ).int
                                  }
                                </del>
                              )}
                              {cart.shipping_cost === 0 ? (
                                <div className="green">
                                  <h3>Envío gratis!</h3>
                                </div>
                              ) : (
                                <div className="cart-shipping-cost-container">
                                  {flash_shipping && (
                                    <div className="ship-gradient"></div>
                                  )}
                                  <h3>
                                    ${priceFormat(cart.shipping_cost).int}
                                  </h3>
                                  <p>{priceFormat(cart.shipping_cost).cents}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="total-section-inner">
                            <h2>Total:</h2>
                            <div>
                              <h2>
                                ${priceFormat(total + cart.shipping_cost).int}
                              </h2>
                              <p>{priceFormat(total).cents}</p>
                            </div>
                          </div>

                          <div className="cart-button-section">
                            <button
                              className="g-white-button details-button"
                              disabled={
                                !cart ||
                                cart.length < 1 ||
                                !selectedAdd ||
                                loadingPayment
                              }
                              onClick={openCheckout}
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
                            Necesitas especificar una dirección de envío antes
                            de realizar el pago.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="cart-buylater-inner">
                  {!cart.buyLater || cart.buyLater.length < 1 ? (
                    <h1>No tienes productos guradados</h1>
                  ) : (
                    <div>
                      {cart.buyLater.map((p) => (
                        <CartCard
                          key={p._id}
                          premium={p.premium}
                          on_cart={false}
                          on_sale={p.on_sale}
                          img={p.thumbnail}
                          name={p.name}
                          prodId={p._id}
                          price={p.price}
                          sale_price={p.sale_price}
                          free_shipping={p.free_shipping}
                          discount={p.discount}
                          brand={p.brand}
                          prodQuantity={p.quantity}
                          stock={p.stock}
                          buyLater={buyLater}
                          buyNow={buyNow}
                          deleteP={deleteProduct}
                          source={"buyLater"}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <form
        id="checkout-container"
        method="GET"
        action={`/orders/post-sale/${orderId}`}
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
        <div>
          <h1>Selecciona una dirección</h1>
          <div>
            {address?.map((e) => (
              <div key={e._id}>
                {`${e.street_name} ${e.street_number}, ${e.city}`}
                <button onClick={() => handleSelect(e._id.toString())}>
                  {" "}
                  Seleccionar{" "}
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                openAddForm(true);
                closeAddList();
              }}
            >
              Añadir una nueva
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isOpenCheckout} closeModal={closeCheckout}>
        <div>
          <p>Pagar con:</p>

          <div className="cart-checkout-modal-button-container">
            <div>
              <button
                className="g-white-button details-button"
                disabled={
                  !cart || cart.length < 1 || !selectedAdd || loadingPayment
                }
                onClick={goCheckout}
              >
                {loadingPayment === "S" ? (
                  <Spinner className="cho-svg" />
                ) : (
                  "Stripe"
                )}
              </button>
              <br />
              <b>Stripe</b>

              <ul>
                <li>
                  <b>card:</b> <i>4242 4242 4242 4242</i>
                </li>
                <li>
                  <b>expiration:</b> <i>fecha mayor a la actual</i>
                </li>
                <li>
                  <b>cvc:</b> <i>123</i>
                </li>
                <li>
                  <b>mail:</b> <i>cualquiera</i>
                </li>
              </ul>
            </div>

            <div>
              <button
                className="g-white-button details-button"
                disabled={
                  !cart || cart.length < 1 || !selectedAdd || loadingPayment
                }
                onClick={openMP}
              >
                {loadingPayment === "MP" ? (
                  <Spinner className="cho-svg" />
                ) : (
                  "MercadoPago"
                )}
              </button>
              <br />
              <b>Mercadopago</b>

              <ul>
                <li>
                  <b>card:</b> <i>5416 7526 0258 2580</i>
                </li>
                <li>
                  <b>expiration:</b> <i>11/25</i>
                </li>
                <li>
                  <b>cvc:</b> <i>123</i>
                </li>
                <li>
                  <b>nombre:</b> <i>apro</i>
                </li>
                <li>
                  <b>dni:</b> <i>12345678</i>
                </li>
                <li>
                  <b>mail:</b> <i>cualquiera argentino</i>
                </li>
              </ul>
            </div>
          </div>
          <p className="cart-warning-message">
            <WarningIcon /> A continuación se simulará un pago. Seleccione un
            Checkout y<br /> utilize los datos de prueba correspondientes a la
            plataforma que se elija.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Cart;
