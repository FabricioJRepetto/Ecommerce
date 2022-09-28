import React from "react";
import { formatDate } from "../../helpers/formatDate";
import { priceFormat } from "../../helpers/priceFormat";
import "./SaleCard.css";

const SaleCard = ({ sale }) => {
  const { buyer, product, price, quantity, delivery_date, payment_date } = sale;

  return (
    <div className="profile-order-card-container">
      <span className="profile-details-price-mobile profile-sale-card">
        <div className="profile-order-products-details">
          <div className="profile-order-carousel-container profile-order-img-container">
            <img src={product.images[0].imgURL} alt={"product"} />
            <div className="card-image-back-style"></div>
          </div>

          <div className="profile-order-products-names-container">
            <p>
              {quantity > 1 && `${quantity}x `}
              {product.name}
            </p>
          </div>
        </div>

        <h3 className="profile-price-mobile">
          ${priceFormat(quantity * price).int}
        </h3>
      </span>

      <div>
        <p>{buyer.name}</p>
        <p>{buyer.email}</p>
        <p>Pagado el {formatDate(Number(payment_date))}</p>
      </div>
      {/* {delivery_date && <DeliveryProgress order={order} />} */}

      <h3 className="profile-price-desktop">
        ${priceFormat(quantity * price).int}
      </h3>
    </div>
  );
};

export default SaleCard;