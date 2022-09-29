import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { priceFormat } from "../../helpers/priceFormat";
import { resizer } from "../../helpers/resizer";
import QuantityInput from "../Cart/QuantityInput";
import { DeleteIcon } from '@chakra-ui/icons';
import { ReactComponent as MenuDots } from "../../assets/svg/kebab.svg";

import "./CartCard.css";

const CartCard = ({ on_cart, productData, buyLater, deleteP, buyNow, source, loading }) => {
  const {
    thumbnail: img,
    // premium,
    name,
    price,
    sale_price,
    on_sale,
    discount,
    _id: prodId,
    free_shipping,
    stock,
    quantity: prodQuantity
  } = productData;

  const navigate = useNavigate();
  const [menuOptions, setMenuOptions] = useState(false);
  const [disable, setDisable] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [moving, setMoving] = useState(false)

    useEffect(() => {
        console.log(prodId);
        setTimeout(() => {
            setMounted(true)            
        }, 100);
        // eslint-disable-next-line
    }, [])

    const willUnmount = (del) => {
        setMounted(false)
        setTimeout(() => {
            setMoving(true)            
        }, 100);
        del 
        ? setTimeout(() => {
            deleteP(prodId, source)            
        }, 300)
        : setTimeout(() => {
            buyLater(prodId)            
        }, 300)
        
     }

    const closeModal = (e) => { 
        e.stopPropagation(); 
        setMenuOptions(false);
     }

  return (
    <div className={`cart-card-container ${mounted ? 'card-fadeout' : 'card-fadein'} ${moving && 'card-shrink'}`}>
        
            <div className="product-cart-card-head">
                <div onClick={() =>
                    navigate(`/details/${prodId}`)
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
                        <span onClick={()=>willUnmount(true)}
                            className='cart-option-delete-icon'>
                            <DeleteIcon />
                        </span>
                        <span onClick={() => setMenuOptions(!menuOptions)}>
                            <MenuDots className='menu-dots-svg grey'/>
                        </span>                
                    </div>
                    {menuOptions && <div className="cartcard-modal-options">                        
                        <p className="pointer" onClick={(e) => {closeModal(e); setDisable(false); willUnmount(false)}}>
                        {source === "buyLater" ? "Mover al carrito" : "Guardar para después"}
                        </p>
                        <p className="pointer" onClick={(e) => {closeModal(e); setDisable(false); buyNow(prodId, source)}}>
                            Comprar ahora
                        </p>
                    </div>}
                </div> 
            </div>

        {menuOptions && <div className="cartcard-optionscloser" onClick={closeModal}></div>}
        {disable && <div className="cartcard-optionscloser cartcard-disabled" onClick={(e) => e.stopPropagation()}></div>}
      </div>

      <div className="cartcard-tail-section">
        
        <QuantityInput
            prodId={prodId}
            price={on_sale ? sale_price : price}
            stock={stock}
            prodQuantity={prodQuantity}
            loading={loading}
            on_cart={on_cart}
            />

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
