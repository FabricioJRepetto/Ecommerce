import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import "./MiniCard.css";
import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WishlistButton as Fav } from "./WishlistButton";
import LoadingPlaceHolder from "../common/LoadingPlaceHolder";
import { priceFormat } from "../../helpers/priceFormat";

const MiniCard = ({
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
    <div className={`minicard-container`}>
      <div
        className={` ${special && "special-frame-right"} ${
          special && visible && "mimic"
        }`}
      ></div>
      <div
        className={` ${special && "special-frame-left"} ${
          special && visible && "mimic"
        }`}
      ></div>
      {(loading || !name)
        ? <div className="loading-mini-card">
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
       : <div
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className={`product-mini-card ${visible && "minicard-height"} ${
            ready && "fade-in"
          } ${special && "special-frame"}`}
        >
          {session && <Fav visible={visible} fav={fav} prodId={prodId} />}

          <div onClick={() => navigate(premium ? `/premium/${prodId}` : `/details/${prodId}`)}>
            <div className="minicard-img-section">
              <img src={resizer(img, 180)} alt="product" onLoad={readySetter} />
            </div>

            <div className="minicard-details-section">
              <div className={`minicard-original-price ${visible && visible}`}>
                {visible && on_sale && (
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

              <div className="free-shipping mc-mrgn">
                {free_shipping && "envío gratis"}
              </div>

              <div className={`minicard-prod-name-container mc-mrgn`}>
                <div className={`minicard-prod-name ${visible && "visible"}`}>
                  {name}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default MiniCard;
