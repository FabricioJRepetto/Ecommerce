import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../helpers/formatDate";
import { priceFormat } from "../../helpers/priceFormat";
import DeliveryProgress from "../common/DeliveryProgress";
import ReturnButton from "../common/ReturnButton";
import Carousel from "../Home/Carousel/Carousel";
import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import "./OrderDetails.css";

const OrderDetails = ({ order, setOrderDetails }) => {
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setOrderDetails(null);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>Resumen de la compra</h1>
      <span>
        <div className="order-details-carousel-info-container">
          {order.images.length && order.images.length > 1 ? (
            <div className="profile-order-carousel-container">
              <Carousel
                images={order.images}
                interval={2500}
                pausable={false}
                width="8rem"
                height="8rem"
                id={order.id}
              />
              <div className="card-image-back-style"></div>
            </div>
          ) : (
            order.images.length &&
            order.images.length === 1 && (
              <div className="profile-order-carousel-container profile-order-img-container">
                <img
                  key={order.images[0].img}
                  src={order.images[0].img}
                  alt={"product"}
                />
                <div className="card-image-back-style"></div>
              </div>
            )
          )}
          <span className="order-details-info-container order-details-info-container-desktop">
            <h3>
              Compra #<i>{order.id}</i>
            </h3>
            <h3>
              {order.payment_source === "Stripe"
                ? "Tarjeta de crédito"
                : "MercadoPago"}
            </h3>
            {order.status === "approved" && (
              <h3>Pagado el {formatDate(order.payment_date).slice(0, -6)}</h3>
            )}
          </span>
          <span className="order-details-info-container order-details-info-container-mobile">
            <p>
              Compra #<i>{order.id}</i>
            </p>
            <p>
              {order.payment_source === "Stripe"
                ? "Tarjeta de crédito"
                : "MercadoPago"}
            </p>
            {order.status === "approved" && (
              <p>Pagado el {formatDate(order.payment_date).slice(0, -6)}</p>
            )}
          </span>
        </div>

        <div className="order-details-products-price-container">
          {React.Children.toArray(
            order.products.map((prod) => (
              <div>
                <span className="order-details-product-quantity">
                  <p
                    className="order-details-product-link g-text-button"
                    onClick={() => navigate(`/details/${prod.product_id}`)}
                  >
                    {prod.quantity > 1 && `${prod.quantity}x `}
                    {prod.product_name}
                  </p>
                </span>
                <p>
                  {prod.sale_price !== prod.price && prod.sale_price !== 0 && (
                    <>
                      <span className="order-details-off">
                        <Sale />
                        {`-${Math.round(
                          100 - (prod.sale_price * 100) / prod.price
                        )}% `}
                      </span>
                    </>
                  )}
                  {prod.quantity > 1 ? ` ${prod.quantity}x ` : ` `}$
                  {prod.sale_price !== prod.price && prod.sale_price !== 0
                    ? `${priceFormat(prod.sale_price).int}`
                    : `${priceFormat(prod.price).int}`}
                </p>
              </div>
            ))
          )}
        </div>

        <span className="order-details-address-shippingcost-total-container">
          <p>
            {`
                            ${order.shipping_address?.street_name}
                            ${order.shipping_address?.street_number},
                            ${order.shipping_address?.city},
                            ${order.shipping_address?.zip_code},
                            ${order.shipping_address?.state}
                            `}
          </p>

          <span className="order-details-shippingcost-total-container">
            {!order.shipping_cost ? (
              <p className="order-details-free-shipping-text">Envío gratis</p>
            ) : order.flash_shipping ? (
              <p>
                <span className="g-gradient-text">Envío Flash</span> $
                {priceFormat(order.shipping_cost).int}
              </p>
            ) : (
              <p>Envío estándar ${priceFormat(order.shipping_cost).int}</p>
            )}

            <h2>${priceFormat(order.total + order.shipping_cost).int}</h2>
          </span>
        </span>
      </span>

      <div className="order-details-last-container">
        {order.status === "pending" && (
          <>
            <p>Expira el {formatDate(order.expiration_date_to).slice(0, -6)}</p>
            {order.payment_link && (
              <div>
                <a
                  href={order.payment_link}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="g-white-button">Finalizar compra</button>
                </a>
              </div>
            )}
          </>
        )}

        {order.status === "cancelled" && (
          <p className="order-details-cancelled-text">Compra cancelada</p>
        )}

        {order.delivery_date && <DeliveryProgress order={order} />}
      </div>

      <ReturnButton
        to={"/profile/orders"}
        onClick={() => setOrderDetails(null)}
      />
    </div>
  );
};

export default OrderDetails;
