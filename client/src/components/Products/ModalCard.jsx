import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import { priceFormat } from "../../helpers/priceFormat";
import "./ModalCard.css";

import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WishlistButton as Fav } from "./WishlistButton";

const ModalCard = ({ productData, fav, close }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { session } = useSelector((state) => state.sessionReducer);

  const {
    thumbnail: img,
    name,
    price,
    premium,
    sale_price,
    discount,
    _id: prodId,
    free_shipping,
    on_sale,
  } = productData;

  const openProduct = (id) => {
    navigate(premium ? `/premium/${id}` : `/details/${id}`);
    close(false);
  };

  return (
    <div
      key={prodId}
      onClick={() => openProduct(prodId)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="product-modal-card pointer"
    >
      {session && visible && (
        <div className="modal-card-wishlist-button-container">
          <Fav
            visible={visible}
            fav={fav}
            prodId={prodId}
            modal
            position={false}
          />
        </div>
      )}

      <div className={`card-main-container${visible ? " card-hover" : ""}`}>
        <div className="modal-card-img-container">
          <img src={resizer(img, 96)} alt="product" />
          <div className="card-image-back-style"></div>
        </div>

        <div className="card-details-container">
          <p className="modal-card-name-container modalcard-mrgn">{name}</p>

          <div className="card-price-container modalcard-mrgn">
            <div className="modal-card-price-section">
              <div className="modalcard-price-section-inner">
                <p>${priceFormat(on_sale ? sale_price : price).int}</p>
              </div>

              {on_sale && (
                <div className="minicard-sale-section">
                  <Sale className="onsale-svg" />
                  <p>{`${discount}% off`}</p>
                </div>
              )}
            </div>
          </div>

          <div className="free-shipping modalcard-mrgn">
            {free_shipping && "Envío gratis"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCard;
