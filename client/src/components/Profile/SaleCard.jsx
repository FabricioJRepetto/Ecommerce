import React from "react";
import { formatDate } from "../../helpers/formatDate";
import { priceFormat } from "../../helpers/priceFormat";

import "./SaleCard.css";

const SaleCard = ({ sale }) => {
  const { buyer, product, price, quantity, payment_date } = sale;

  return (
    <div className="profile-order-card-container profile-sale-card-container">
      <span className="profile-details-price-mobile profile-sale-card">
        <div className="profile-order-products-details">
          <div className="profile-order-carousel-container profile-order-img-container">
            <img src={product.thumbnail} alt={"product"} />
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

      <span>
        <p>{buyer.name}</p>
        <p>{buyer.email}</p>
        <p>Pagó el {formatDate(Number(payment_date))}</p>
      </span>
      {/* {delivery_date && <DeliveryProgress order={order} />} */}

      <h3 className="profile-price-desktop">
        ${priceFormat(quantity * price).int}
      </h3>
    </div>
  );
};

export default SaleCard;
