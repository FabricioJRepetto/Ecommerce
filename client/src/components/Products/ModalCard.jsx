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
    sale_price,
    discount,
    _id: prodId,
    free_shipping,
    on_sale,
  } = productData;

  const first = (id) => { 
        navigate(`/details/${id}`);
        close(false);
   }

  return (
    <div
      key={prodId}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="product-modal-card"
    >
      {session && <Fav visible={visible} fav={fav} prodId={prodId} />}

      <div className="card-main-container">
        <div
          onClick={() => first(prodId)}
          className="modal-card-img-container pointer"
        >
          <img src={resizer(img, 96)} alt="product" />
        </div>

        <div className="card-details-container">

          <p
            className="card-name pointer c-mrgn"
            onClick={() => first(prodId)}
          >
            {name}
          </p>

          <div className="card-price-container c-mrgn">
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

          <div className="free-shipping c-mrgn">
            {free_shipping && "envío gratis"}
          </div>         
        </div>
      </div>
    </div>
  );
};

export default ModalCard;
