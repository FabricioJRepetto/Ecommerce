import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WishlistButton as Fav } from "./WishlistButton";
import LoadingPlaceHolder from "../common/LoadingPlaceHolder";
import { priceFormat } from "../../helpers/priceFormat";

import "./MiniCard.css";

const MiniCard = ({productData = false, fadeIn = true, fav, loading}) => {
  
    const {
        thumbnail: img,
        name,
        premium,
        price,
        sale_price,
        discount,
        _id: prodId,
        free_shipping,
        on_sale    
    } = productData;

  const special = !/MLA/g.test(prodId);
  const navigate = useNavigate();
  const [ready, setReady] = useState(!fadeIn);
  const { session } = useSelector((state) => state.sessionReducer);

  const readySetter = () => {
    setReady(true);
  };

  return (
    <div className="minicard-container">
      <div
        className={`${special ? "special-frame-right" : ""}`}
      ></div>
      <div
        className={`${special ? "special-frame-left" : ""}`}
      ></div>
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
        <div className={`product-mini-card ${
            ready ? "fade-in" : ""
          }`}
        >
          {session && <span className={`minicard-wishlist-cotnainer ${fav &&'visible'}`}>
                        <Fav fav={fav} prodId={prodId} />
                    </span>}

          <div
            onClick={() =>
              navigate(premium ? `/premium/${prodId}` : `/details/${prodId}`)
            }
          >
            <div className="minicard-img-section">
              <img src={resizer(img, 180)} alt="product" onLoad={readySetter} />
            </div>

            <div className="minicard-details-section">
              <div className={`minicard-original-price`}>
                {on_sale && (
                  <del>{"$" + priceFormat(price).int}</del>
                )}
              </div>
              <div className="minicard-price-section">
                <div className="minicard-price-section-inner">
                  <h2>${priceFormat(on_sale ? sale_price : price).int}</h2>
                  <p>{priceFormat(on_sale ? sale_price : price)?.cents}</p>
                </div>
                {on_sale && (
                  <div className="minicard-sale-section">
                    <Sale className="onsale-svg" />
                    <b>-{discount}%</b>
                  </div>
                )}
              </div>

              <div className="free-shipping mc-mrgn provider-text">
                {free_shipping && "Envío gratis"}
              </div>

              <div className="minicard-prod-name-container mc-mrgn">
                <div
                  className='minicard-prod-name'
                >
                  {name}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCard;
