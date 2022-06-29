import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import "./MiniCard.css";

import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WhishlistButton as Fav } from "./WhishlistButton";

import { loadIdProductToEdit } from "../../Redux/reducer/productsSlice";

const MiniCard = ({
  img,
  name,
  price,
  prodId,
  free_shipping,
  fav,
  on_sale,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const session = useSelector((state) => state.sessionReducer.session);
  const dispatch = useDispatch();

  const editProduct = (prodId) => {
    dispatch(loadIdProductToEdit(prodId));
    navigate("/productForm");
  };

  //! acomodar propiedades de sale

  return (
    <div
      key={prodId}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`product-mini-card ${visible && "minicard-height"}`}
    >
      {session && <Fav visible={visible} fav={fav} prodId={prodId} />}

      <div onClick={() => navigate(`/details/${prodId}`)}>
        <div className="minicard-img-section">
          <img src={resizer(img, 180)} alt="product" />
        </div>

        <div className="minicard-details-section">
          <div className={`minicard-original-price ${visible && visible}`}>
            {visible && on_sale && <del>${price}</del>}
          </div>
          <div className="minicard-price-section">
            <div>
              <h2>${price}</h2>
            </div>
            {on_sale && (
              <div className="minicard-sale-section">
                <Sale className="onsale-svg" />
                <p>30% off</p>
              </div>
            )}
          </div>

          <div className="free-shipping mc-mrgn">
            {free_shipping && "envío gratis"}
          </div>

          <div className={`minicard-prod-name mc-mrgn ${visible && "visible"}`}>
            {name}
          </div>
        </div>
      </div>
      <button type="button" onClick={() => editProduct(prodId)}>
        EDITAR
      </button>
    </div>
  );
};

export default MiniCard;
