import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WishlistButton } from "../Products/WishlistButton";
import LoadingPlaceHolder from "../common/LoadingPlaceHolder";
import { priceFormat } from "../../helpers/priceFormat";
import "./HistoryCard.css";

const HistoryCard = ({ product, free_shipping, fav }) => {
  const {
    thumbnail: img,
    name,
    price,
    premium,
    sale_price,
    discount,
    _id: prodId,
    on_sale,
  } = product;
  const special = !/MLA/g.test(prodId);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const { session } = useSelector((state) => state.sessionReducer);

  const readySetter = () => {
    setReady(true);
  };

  return (
    <div className="history-card-container">
      {/* {loading || !name ? (
        <div className="loading-mini-card">
          <div className="minicard-img-section">
            <LoadingPlaceHolder extraStyles={{ height: "100%" }} />
          </div>
          <div>
            <LoadingPlaceHolder
              extraStyles={{ height: "30px", margin: "10px 0 0 0" }}
            />
            <LoadingPlaceHolder
              extraStyles={{ height: "15px", margin: "10px 0 0 0" }}
            />
          </div>
        </div>
      ) : ( */}
      <div className={`history-card${ready ? " history-card-fade-in" : ""}`}>
        {session && (
          <span className="history-card-wishlist-cotnainer">
            <WishlistButton visible={visible} fav={fav} prodId={prodId} />
          </span>
        )}
        {special && <i className="provider-text special-card">PROVIDER</i>}

        <div
          onClick={() =>
            navigate(premium ? `/premium/${prodId}` : `/details/${prodId}`)
          }
        >
          <div className="history-card-img-container">
            <img src={resizer(img, 180)} alt={name} onLoad={readySetter} />
          </div>

          <div className="history-card-details-section">
            <div className="history-card-name-container">
              <h4>{name}</h4>
            </div>

            <div className="history-good-info-container">
              <div className="free-shipping">
                {free_shipping && "Envío gratis"}
              </div>

              {on_sale && (
                <div className="history-card-sale-section">
                  <Sale className="onsale-svg" />
                  <b>-{discount}%</b>
                </div>
              )}
            </div>

            {/* <div className={`history-card-original-price`}>
              {on_sale && <del>{"$" + priceFormat(price).int}</del>}
            </div> */}
            <div className="history-card-price-section">
              <div className="history-card-price-section-inner">
                <h2>${priceFormat(on_sale ? sale_price : price).int}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
