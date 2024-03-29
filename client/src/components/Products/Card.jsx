import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import { priceFormat } from "../../helpers/priceFormat";
import { loadIdProductToEdit } from "../../Redux/reducer/productsSlice";
import "./Card.css";

import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WishlistButton as Fav } from "./WishlistButton";

const Card = ({
  openDeleteProduct,
  openDiscountProduct,
  productData,
  fav,
  outOfStock,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const { session } = useSelector((state) => state.sessionReducer);
  const dispatch = useDispatch();

  const {
    thumbnail: img,
    name,
    price,
    sale_price,
    discount,
    brand,
    _id: prodId,
    free_shipping,
    on_sale,
    premium,
  } = productData;

  const special = !/MLA/g.test(prodId);

  const editProduct = (prodId) => {
    dispatch(loadIdProductToEdit(prodId));
    navigate("/admin/create");
  };

  return (
    <div style={{ position: "relative" }}>
      {special && <b className="special-card">PRO</b>}

      <div
        key={prodId}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="product-card"
      >
        {session && <Fav visible={visible} fav={fav} prodId={prodId} />}

        <div className="card-main-container">
          <div
            onClick={() =>
              navigate(premium ? `/premium/${prodId}` : `/details/${prodId}`)
            }
            className="card-img-container pointer"
          >
            <img src={resizer(img, 180)} alt="product" />
          </div>

          <div className="card-details-container">
            <div>{brand && brand.toUpperCase()}</div>

            <h2
              className="card-name pointer c-mrgn"
              onClick={() => navigate(`/details/${prodId}`)}
            >
              {name}
            </h2>

            <div className="card-price-container c-mrgn">
              <div className="card-original-price">
                {on_sale && <del>${priceFormat(price).int}</del>}
              </div>
              <div className="card-price-section">
                <div className="minicard-price-section-inner">
                  <h2>${priceFormat(on_sale ? sale_price : price).int}</h2>
                  <p>{priceFormat(on_sale ? sale_price : price).cents}</p>
                </div>

                {on_sale && (
                  <div className="minicard-sale-section">
                    <Sale className="onsale-svg" />
                    <p>{`${Math.round(discount)}% off`}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="free-shipping c-mrgn">
              {free_shipping && "Envío gratis"}
            </div>

            {location.pathname === "/admin/products" && (
              <>
                {outOfStock && (
                  <b style={{ background: "red", color: "white" }}>
                    {" "}
                    SIN STOCK{" "}
                  </b>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    editProduct(prodId);
                  }}
                >
                  EDITAR
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteProduct({ prodId, name });
                  }}
                >
                  ELIMINAR
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDiscountProduct({ prodId, name, price });
                  }}
                >
                  DESCUENTO
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
