import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadIdProductToEdit } from "../../Redux/reducer/productsSlice";
import { resizer } from "../../helpers/resizer";
import { priceFormat } from "../../helpers/priceFormat";
import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { ReactComponent as AddCart } from "../../assets/svg/addcart.svg";
import { ReactComponent as Edit } from "../../assets/svg/edit.svg";
import { ReactComponent as Offer } from "../../assets/svg/offer.svg";
import { ReactComponent as Pause } from "../../assets/svg/pause.svg";
import { ReactComponent as Play } from "../../assets/svg/play.svg";
import { WishlistButton } from "../Products/WishlistButton";
import { useCheckout } from "../../hooks/useCheckout";
import "./WishlistCard.css";

const WishlistCard = ({
  openDeleteProduct,
  openReactivateProduct,
  openDiscountProduct,
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
    seller,
    _id: prodId,
    free_shipping,
    on_sale,
    premium,
    available_quantity,
  } = productData;
  const special = seller === "PROVIDER";

  const readySetter = () => {
    setReady(true);
  };

  const editProduct = (prodId) => {
    dispatch(loadIdProductToEdit(prodId));
    location.pathname !== "/admin/products"
      ? navigate("/create")
      : navigate("/admin/create");
  };

  return (
    <div
      className="wishlist-card-container"
      onClick={() =>
        navigate(premium ? `/premium/${prodId}` : `/details/${prodId}`)
      }
    >
      {location.pathname !== "/products" && special && (
        <>
          {premium ? (
            <div className="special-card-premium"></div>
          ) : (
            <b className="special-card">PROVIDER</b>
          )}
        </>
      )}
      {(location.pathname === "/admin/products" ||
        location.pathname === "/profile/products") &&
        !productData.active && (
          <div className="wishlist-card-paused-text">PAUSADO</div>
        )}

      <div
        /* key={prodId}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)} */
        className={`wishlist-product-card${
          ready ? " wishlist-card-fade-in" : ""
        }`}
      >
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
                  <>
                    <div className="minicard-sale-section">
                      <Sale className="onsale-svg" />
                      <p>{`${Math.round(discount)}% off`}</p>
                    </div>
                  </>
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
          </div>
        </div>

        {session &&
          (location.pathname !== "/profile/products" &&
          location.pathname !== "/admin/products" ? (
            <>
              <WishlistButton fav={fav} prodId={prodId} />

              {!onCart.includes(prodId) && (
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
            </>
          ) : (
            <div className="wishlist-card-buttons-container">
              <span
                className="wishlist-edit-button-container"
                onClick={(e) => {
                  e.stopPropagation();
                  editProduct(prodId);
                }}
              >
                <div className="publication-tootlip">Editar publicación</div>
                <Edit />
                <div className="wishlist-edit-gradient"></div>
              </span>

              <span
                className="wishlist-offer-button-container"
                onClick={(e) => {
                  e.stopPropagation();
                  openDiscountProduct({ prodId, name, price, on_sale });
                }}
              >
                <div className="publication-tootlip">Actualizar descuento</div>
                <Offer />
                <div className="wishlist-offer-gradient"></div>
              </span>

              {productData.active ? (
                <span
                  className="wishlist-pause-button-container"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteProduct({ prodId, name });
                  }}
                >
                  <div className="publication-tootlip">Pausar publicación</div>
                  <Pause />
                  <div className="wishlist-pause-gradient"></div>
                </span>
              ) : (
                <span
                  className="wishlist-play-button-container"
                  onClick={(e) => {
                    e.stopPropagation();
                    openReactivateProduct({ prodId, name, available_quantity });
                  }}
                >
                  <div className="publication-tootlip">
                    Reanudar publicación
                  </div>
                  <Play />
                  <div className="wishlist-play-gradient"></div>
                </span>
              )}
            </div>
          ))}

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

export default WishlistCard;
