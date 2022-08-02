import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
// import { loadMercadoPago } from "../../helpers/loadMP";
import { priceFormat } from "../../helpers/priceFormat"
import { useNotification } from "../../hooks/useNotification";
import './BuyNow.css'

import { ReactComponent as Arrow } from '../../assets/svg/arrow-right.svg'
import { ReactComponent as Location } from '../../assets/svg/location.svg'
import { ReactComponent as Ship } from '../../assets/svg/ship.svg'
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg'
import QuantityInput from "./QuantityInput";
import { useSelector } from "react-redux";
import LoadingPlaceHolder from "../common/LoadingPlaceHolder";

const BuyNow = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hasPreviousState = location.key !== "default";
    const session = useSelector((state) => state.sessionReducer.session);    
    const [notification] = useNotification();

    const [id, setId] = useState();
    const [product, setProduct] = useState();
    const [address, setAddress] = useState(null);
    const [flash_shipping, setflash_shipping] = useState(false)
    const [newAdd, setNewAdd] = useState({});
    const [selectedAdd, setSelectedAdd] = useState(null);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [isOpenAddForm, openAddForm, closeAddForm] = useModal();
    const [isOpenAddList, openAddList, closeAddList] = useModal();

    const SHIP_COST = 500;

    useEffect(() => {
        if (session) {
            getProd();
            getAddress();
        } else {
             if (hasPreviousState) {
                navigate(-1);
            } else {
                navigate("/");
            }
        }

        return () => {
            axios.post(`/cart/`, {product_id: ''});
            console.log('buynow reseted');
        }
    // eslint-disable-next-line    
    }, []);

    const getProd = async () => {        
        const { data } = await axios(`/cart/`);
        console.log(data);
        setId(data.buyNow);
        if (data.buyNow === '') {
            if (hasPreviousState) {
                navigate(-1);
            } else {
                navigate("/");
            }
        } else {
            const { data: p } = await axios(`/product/${data.buyNow}`);
            console.log(p);
            if (p) {
                setProduct(p);
            }
        }        
        setLoading(false);
    };

    const getAddress = async () => { 
        const { data } = await axios('/address');
        if (data.address) {
            setAddress(data.address);
            if (!selectedAdd) {
                const def = data.address.find(e =>
                    e.isDefault === true
                )
                setSelectedAdd(def);
            }
        }
        setLoading(false);
    };
    const handleChange = ({ target }) => {
        const { name, value, validity } = target;
        let validatedValue;

        if (!validity.valid) {
        validatedValue = newAdd[name];
        } else {
        validatedValue = value;
        }
        setNewAdd({
        ...newAdd,
        [name]: validatedValue,
        })
    };
    const handleSubmit = async (e) => { 
        e.preventDefault();
        if (newAdd.state && newAdd.city && newAdd.zip_code && newAdd.street_name && newAdd.street_number) {
            closeAddForm();
            const { data } = await axios.post(`/address`, newAdd);
            console.log(data);
            notification(data.message, '', 'success')
            setSelectedAdd(data.address.pop());
            getAddress();
        }
     };     
     const handleSelect = (id) => { 
        let aux = address.filter(e => e._id.toString() === id.toString());
        setSelectedAdd(aux[0]);
        closeAddList();
     };

     const shippingMode = async (boolean) => { 
        setflash_shipping(boolean);
        const { data } = await axios.put('/cart/flash', {flash_shipping: boolean});
        console.log(data.cart);
    }

    const goCheckout = async () => {
        setLoadingPayment('S');
        // crea la order
        const { data: orderId } = await axios.post(`/order/buyNow`, {
            ...selectedAdd,
            flash_shipping,
            quantity,
            product_id: id,
        });
        // crea session de stripe y redirige
        const { data } = await axios.post(`/stripe/${orderId}`);
        notification('Serás redirigido a la plataforma de pago.', '', 'warning');
        setTimeout(() => {
            window.location.replace(data.url);
        }, 4000);
        return null
    };
    
    const openMP = async () => { 
        setLoadingPayment('MP');
        // crea la order
        const { data: orderId } = await axios.post(`/order/buyNow`, {
            ...selectedAdd,
            flash_shipping,
            quantity,
            product_id: id,
        });
        // crea la preferencia para mp con la order y ridirige
        const { data }  = await axios.get(`/mercadopago/${orderId}`);
        notification('Serás redirigido a la plataforma de pago.', '', 'warning');
        setTimeout(() => {
            window.location.replace(data.init_point);
        }, 3000);
        return null

        //* abre el MODAL de MP con la id de la preferencia
        // loadMercadoPago(data.id, 
        // setLoadingPayment);
     };

     const shippingCost = () => { 
        let cost = 0;
        if (flash_shipping) {
            if (product.free_shipping) {
                cost = SHIP_COST / 2;
            } else {
                cost = SHIP_COST * 1.5;
            }
        } else {
            if (product.free_shipping) {
                cost = 0;
            } else {
                cost = SHIP_COST;
            }
        }
        return cost
      }

      const deliverDate = (flash = false) => {        
        if (flash) {
            return 'mañana.';
        }
        // 259200000 (3 dias)
        const today = new Date(Date.now()+259200000).getDay();
        let days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        return ` el ${days[today]}.`;
    }

    return (
        <div className="buynow-container">

            {product && !loading
            ?<div className="buynow-inner">
                <div className="buynow-product-details">
                    <div className="buynow-product-inner">
                        <div className="buynow-img-container">
                            {!loaded && <LoadingPlaceHolder extraStyles={{ height: "100%" }}/>}
                            {<img src={product && product.images[0].imgURL} 
                                alt="prod" onLoad={() => setLoaded(true)} className={`buynow-img ${loaded && 'visible'}`}/>}
                        </div>
                        <p>{product.name}</p>
                    </div>
                    <QuantityInput stock={product.available_quantity} 
                    prodQuantity={1} bnMode setQ={setQuantity} loading={loadingPayment}/>
                </div>

                <div className="buynow-inner-lateral">
                    <div>
                        <div className="buynow-address-container">
                            <div>
                                {selectedAdd
                                    ?<div 
                                        onClick={openAddList}
                                        className='buynow-address-selector'
                                        name={'address-container'}>
                                            <Location className='address-icon' />
                                            <p>{selectedAdd.street_name+' '+selectedAdd.street_number}</p>
                                        <Arrow className='buynow-arrow-address-selector'/>
                                    </div>
                                    :<div 
                                        onClick={openAddForm}
                                        className="buynow-address-selector">
                                        <b>You have no address asociated,</b> 
                                        please create one to proceed. 
                                        <Arrow className='arrow-address-selector'/>
                                    </div>}

                                <div onClick={()=> shippingMode(true)} className={flash_shipping ? 'selected-shipping-mode' : ''}>
                                    <h3>flash shipping</h3>
                                    <p>llega {deliverDate(true)}</p>
                                    <input type="checkbox" readOnly checked={flash_shipping}/>
                                </div>

                                <div onClick={()=> shippingMode(false)} className={!flash_shipping ? 'selected-shipping-mode' : ''}>
                                    <h3>Envío standard</h3>
                                    <p>llega {deliverDate()}</p>
                                    <input type="checkbox" readOnly checked={!flash_shipping} />
                                </div>
                            
                            </div>
                        </div>

                        <div className="buynow-total-container">
                            <div className="cart-total">
                                {product.free_shipping && <del className="grey">${priceFormat(SHIP_COST).int}</del>}
                                {product.free_shipping && !flash_shipping
                                ? <div className="cart-ship-total green">
                                    <Ship className='ship-svg' />
                                    <h3>Envío gratis!</h3>
                                </div>
                                : <div>
                                    <h3>${priceFormat(shippingCost()).int}</h3><p>{priceFormat(shippingCost()).cents}</p>
                                    </div> }
                            </div>

                            <div className="buynow-total-inner">
                                <h3>total</h3>
                                <div className="buynow-total-inner-inner">
                                    {product.on_sale &&<div>
                                        <p>-{product.discount}% <del> ${priceFormat(quantity * product.price).int}</del></p>
                                        
                                    </div>}
                                    <h1>${priceFormat(quantity * (product.on_sale ? product.sale_price : product.price)).int}</h1><p>{priceFormat(quantity * (product.on_sale ? product.sale_price : product.price)).cents}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="cart-button-section">
                        <button disabled={(!product || !selectedAdd || loadingPayment)} 
                        onClick={goCheckout}>{ loadingPayment === 'S'
                        ? <Spinner className='cho-svg'/> 
                        : 'Stripe checkout' }</button>

                        <button disabled={(!product || !selectedAdd || loadingPayment)} 
                        onClick={openMP}>{ loadingPayment === 'MP'
                        ? <Spinner className='cho-svg'/> 
                        : 'MercadoPago checkout' }</button>
                    </div>
                </div>
            </div>

            : <div className="buynow-loading">
                <Spinner />
            </div>}

            <form 
            id='checkout-container'
            method="GET"
            action={`/orders/post-sale/`}></form>
            <br />
            <br />
            <br />
            <br />
            <br />
            <ul>
                <br/>
                <p><b>Mercadopago</b></p>
                <li><p>card: <i>5416 7526 0258 2580</i></p></li>
                <li><p>expiration: <i>11/25</i></p></li>
                <li><p>cvc: <i>123</i></p></li>
                <li><p>nombre: <i>apro</i></p></li>
                <li><p>dni: <i>12345678</i></p></li>
                <br/>
                <p><b>stripe</b></p>
                <li><p>card: <i>4242 4242 4242 4242</i></p></li>
                <li><p>expiration: <i>fecha mayor a la actual</i></p></li>
                <li><p>cvc: <i>123</i></p></li>
            </ul>

            <Modal isOpen={isOpenAddForm} closeModal={closeAddForm}>
                <h1>New shipping address</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text" 
                        name="state" 
                        onChange={(e) => setNewAdd({
                                ...newAdd,
                                [e.target.name] : e.target.value
                        })} 
                        placeholder='state' 
                        value={newAdd.state ? newAdd.state : ''}
                    />

                    <input
                        type="text" 
                        name="city" 
                        onChange={(e) => setNewAdd({
                                ...newAdd,
                                [e.target.name] : e.target.value
                        })} 
                        placeholder='city' 
                        value={newAdd.city ? newAdd.city : ''}
                    />

                    <input
                        type="text" 
                        name="zip_code" 
                        onChange={(e) => setNewAdd({
                                ...newAdd,
                                [e.target.name] : e.target.value
                        })} 
                        placeholder='zip code' 
                        value={newAdd.zip_code ? newAdd.zip_code : ''}
                    />

                    <input
                        type="text" 
                        name="street_name" 
                        onChange={(e) => setNewAdd({
                                ...newAdd,
                                [e.target.name] : e.target.value
                        })} 
                        placeholder='street name' 
                        value={newAdd.street_name ? newAdd.street_name : ''}
                    />

                    <input
                            type="number"
                            name="street_number" 
                            pattern="[1-9]"
                            placeholder='street number' 
                            value={newAdd.street_number ? newAdd.street_number : ''}
                            onChange={handleChange}
                        />

                    <button>Create</button>
                </form>
            </Modal>

            <Modal isOpen={isOpenAddList} closeModal={closeAddList}>
                <div>
                    <h1>Select an address</h1>
                    <div>
                        {address?.map(e =>
                            <div key={e._id}>
                                {`${e.street_name} ${e.street_number}, ${e.city}`}
                                <button onClick={()=>handleSelect(e._id.toString())}> Select </button>
                            </div>
                        )}
                        <button onClick={() =>{
                            openAddForm();
                            closeAddList();
                        }}>Add new address</button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default BuyNow;
