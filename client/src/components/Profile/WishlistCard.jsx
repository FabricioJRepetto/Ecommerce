import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadIdProductToEdit } from "../../Redux/reducer/productsSlice";
import { resizer } from "../../helpers/resizer";
import { priceFormat } from "../../helpers/priceFormat";
import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { ReactComponent as AddCart } from "../../assets/svg/addcart.svg";
import { WishlistButton } from "../Products/WishlistButton";
import { useCheckout } from "../../hooks/useCheckout";
import "./WishlistCard.css";

const Card = ({
  openDeleteProduct,
  openDiscountProduct,
  openRemoveDiscount,
  productData,
  fav,
}) => {
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.sessionReducer);
  const { onCart } = useSelector((state) => state.cartReducer);
  const { addToCart, buyNow } = useCheckout();
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

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
    available_quantity,
  } = productData;
  const special = !/MLA/g.test(prodId);

  const readySetter = () => {
    setReady(true);
  };

  const editProduct = (prodId) => {
    dispatch(loadIdProductToEdit(prodId));
    navigate("/admin/productForm");
  };

  return (
    <div
      className="wishlist-card-container"
      onClick={() =>
        navigate(premium ? `/premium/${prodId}` : `/details/${prodId}`)
      }
    >
      {location.pathname !== "/products" && special && (
        <i className="provider-text special-card">PROVIDER</i>
      )}

      <div
        /* key={prodId}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)} */
        className={`wishlist-product-card${
          ready ? " wishlist-card-fade-in" : ""
        }`}
      >
        {session && <WishlistButton fav={fav} prodId={prodId} />}

        {session && !onCart.includes(prodId) && (
          <div
            className="wishlist-addcart-container"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(prodId);
            }}
          >
            <AddCart />
            <div className="wishlist-addcart-gradient"></div>
          </div>
        )}

        <div className="wishlist-images-data-container">
          <div className="wishlist-product-img-container">
            <img src={resizer(img, 160)} alt="product" onLoad={readySetter} />
            <div className="card-image-back-style"></div>
          </div>

          <div className="wishlist-product-data-container">
            <div className="wishlist-product-header">
              {/* {brand && (
                <p className="wishlist-product-brand">{brand.toUpperCase()}</p>
              )} */}
              <p>{name}</p>
              <h3 className="wishlist-product-name-mobile">{name}</h3>
              <h2 className="wishlist-product-name-desktop">{name}</h2>
            </div>

            <div className="wishlist-product-price-container">
              {on_sale && (
                <div className="wishlist-product-original-price">
                  <del>${priceFormat(price).int}</del>
                </div>
              )}

              <div className="wishlist-product-price-section">
                <div>
                  <p className="wishlist-product-price-tinymobile">
                    ${priceFormat(on_sale ? sale_price : price).int}
                  </p>
                  <h3 className="wishlist-product-price-mobile">
                    ${priceFormat(on_sale ? sale_price : price).int}
                  </h3>
                  <h2 className="wishlist-product-price-desktop">
                    ${priceFormat(on_sale ? sale_price : price).int}
                  </h2>
                </div>

                {on_sale && (
                  <div className="minicard-sale-section">
                    <Sale className="onsale-svg" />
                    <p>{`${Math.round(discount)}% off`}</p>
                  </div>
                )}
              </div>
              {available_quantity < 10 && available_quantity > 1 && (
                <p className="g-gradient-text">POCAS UNIDADES</p>
              )}
              {available_quantity === 1 && (
                <p className="g-gradient-text"> ÚLTIMO DISPONIBLE</p>
              )}
              {available_quantity < 1 && (
                <div className="premiumdetails-nostock" title="Fuera de stock">
                  Fuera de stock
                </div>
              )}
            </div>

            <div className="wishlist-free-shipping">
              {available_quantity > 0 && free_shipping && <p>Envío gratis</p>}
            </div>
            {location.pathname === "/admin/products" && (
              <>
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

        {/* <div className="wishlist-buy-buttons-container">
          <>
            <button
              className="g-white-button "
              disabled={available_quantity < 1 || onCart.includes(prodId)}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(prodId);
              }}
            >
              {onCart.includes(prodId) ? "En el carrito" : "Agregar al carrito"}
            </button>
            <button
              className="g-white-button "
              disabled={available_quantity < 1}
              onClick={(e) => {
                e.stopPropagation();
                buyNow(prodId);
              }}
            >
              Comprar ahora
            </button>
          </>
        </div> */}
      </div>
    </div>
  );
};

export default Card;
