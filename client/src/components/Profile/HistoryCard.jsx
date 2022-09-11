import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WishlistButton } from "../Products/WishlistButton";
import LoadingPlaceHolder from "../common/LoadingPlaceHolder";
import { priceFormat } from "../../helpers/priceFormat";
import "./HistoryCard.css";

const HistoryCard = ({
  img,
  name,
  premium,
  price,
  sale_price,
  discount,
  prodId,
  free_shipping,
  fav,
  on_sale,
  loading,
  fadeIn = true,
}) => {
  const special = !/MLA/g.test(prodId);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(!fadeIn);
  const { session } = useSelector((state) => state.sessionReducer);

  const readySetter = () => {
    setReady(true);
  };

  return (
    <div className="history-card-container">
      {loading || !name ? (
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
      ) : (
        <div
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className={`history-card${visible ? " history-card-height" : ""}${
            ready ? " history-card-fade-in" : ""
          }`}
        >
          {session && (
            <WishlistButton visible={visible} fav={fav} prodId={prodId} />
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
              <div
                className={`history-card-original-price ${visible && visible}`}
              >
                {visible && on_sale && (
                  <del>{"$" + priceFormat(price).int}</del>
                )}
              </div>

              {/* <div className="history-card-price-section">
                <div className="history-card-price-section-inner">
                <h3>${priceFormat(on_sale ? sale_price : price).int}</h3>
                </div>
              </div> */}

              <div className="history-card-name-container">
                <h3>{name}</h3>
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

              {/* <div className="history-card-prod-name-container">
                <div
                  className={`history-card-prod-name${
                    visible ? " visible" : ""
                  }`}
                >
                  {name}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;
