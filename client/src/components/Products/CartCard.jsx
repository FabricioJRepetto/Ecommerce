import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { priceFormat } from "../../helpers/priceFormat";
import { resizer } from "../../helpers/resizer";
import QuantityInput from "../Cart/QuantityInput";
import { DeleteIcon } from '@chakra-ui/icons';
import { ReactComponent as MenuDots } from "../../assets/svg/kebab.svg";

import "./CartCard.css";

const CartCard = ({
  img,
  premium,
  name,
  price,
  sale_price,
  on_sale,
  discount,
  brand,
  prodId,
  free_shipping,
  on_cart,
  stock,
  prodQuantity,
  deleteP,
  buyLater,
  buyNow,
  source,
  loading,
}) => {
  const navigate = useNavigate();
  const [menuOptions, setMenuOptions] = useState(false);
  const [disable, setDisable] = useState(false)

    const closeModal = (e) => { 
        e.stopPropagation(); 
        setMenuOptions(false);
     }

  return (
    <div className="cart-card-container" style={disable ? {position: 'relative'} : {}}>
        
            <div className="product-cart-card-head">
                <div onClick={() =>
                    navigate(premium ? `/premium/${prodId}` : `/details/${prodId}`)
                }
                className="product-cart-image-container pointer"
                >
                <img src={resizer(img, 130)} alt="product" />
                <div className="card-image-back-style"></div>
                </div>

                <div className="cart-prod-details">
                <div className="cart-main-details">
                    <div
                    className="cart-card-name pointer"
                    onClick={() => navigate(`/details/${prodId}`)}
                    >
                    {name}
                    </div>                    
                    {free_shipping && (
                    <div className="cart-free-shipping">Envío gratis</div>
                    )}
                </div>
                <div className="cart-product-options">
                    <div className="cart-option-mobile">
                        <span onClick={() => deleteP(prodId, source)}
                            className='cart-option-delete-icon'>
                            <DeleteIcon />
                        </span>
                        <span onClick={() => setMenuOptions(!menuOptions)}>
                            <MenuDots className='menu-dots-svg grey'/>
                        </span>                
                    </div>
                    {menuOptions && <div className="cartcard-modal-options">                        
                        <p className="pointer" onClick={(e) => {closeModal(e); setDisable(true); buyLater(prodId)}}>
                        {source === "buyLater" ? "Mover al carrito" : "Guardar para después"}
                        </p>
                        <p className="pointer" onClick={(e) => {closeModal(e); setDisable(true); buyNow(prodId, source)}}>
                            Comprar ahora
                        </p>
                    </div>}
                </div> 
            </div>

        {menuOptions && <div className="cartcard-optionscloser" onClick={closeModal}></div>}
        {disable && <div className="cartcard-optionscloser cartcard-disabled" onClick={(e) => e.stopPropagation()}></div>}
      </div>

      <div className="cartcard-tail-section">
        {on_cart && (
            <QuantityInput
                prodId={prodId}
                price={on_sale ? sale_price : price}
                stock={stock}
                prodQuantity={prodQuantity}
                loading={loading}
                />
        )}

        <div className="cart-card-price">
            {on_sale && 
            <div className="cart-card-price-discount">
                <div>-{discount}%</div>
                <del>${priceFormat(price).int}</del>
            </div>}
            <div className="cart-card-price-inner">
                <h2>${priceFormat(on_sale ? sale_price : price).int}</h2>
                <p>{priceFormat(on_sale ? sale_price : price)?.cents}</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default CartCard;
