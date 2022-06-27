import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CartCard from "../Products/CartCard";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../hooks/useNotification";
import { cartTotal, loadCart } from "../../Redux/reducer/cartSlice";
import { loadMercadoPago } from "../../helpers/loadMP";
import './Cart.css'

import { ReactComponent as Arrow } from '../../assets/svg/arrow-right.svg'
import { ReactComponent as Ship } from '../../assets/svg/ship.svg'
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg'

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [notification] = useNotification();

    const [cart, setCart] = useState(null);
    const [free_ship_cart, setFree_ship_cart] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [address, setAddress] = useState(null);
    const [newAdd, setNewAdd] = useState({});
    const [selectedAdd, setSelectedAdd] = useState(null);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [loading, setLoading] = useState(true);
    const total = useSelector((state) => state.cartReducer.total);

    const [isOpenAddForm, openAddForm, closeAddForm] = useModal();
    const [isOpenAddList, openAddList, closeAddList] = useModal();

    const SHIP_COST = 300;

    useEffect(() => {
        getCart();
        getAddress();
    // eslint-disable-next-line    
    }, [])

    const getCart = async () => {
        const { data } = await axios('/cart/');
        if (typeof data !== 'string') {
            setCart(data.products);
            setFree_ship_cart(data.free_ship_cart);
        };
        dispatch(cartTotal(data.total));
        dispatch(loadCart(data.id_list));
        setLoading(false);
    };

    const getAddress = async () => { 
        const { data } = await axios('/user/address');
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
            const { data } = await axios.post(`/user/address`, newAdd);
            console.log(data);
            setSelectedAdd(data.pop());
            getAddress();
        }
     };
     
     const handleSelect = (id) => { 
        let aux = address.filter(e => e._id.toString() === id.toString());
        setSelectedAdd(aux[0]);
        closeAddList();
     };

    const deleteProduct = async (id) => {
        const { data } = await axios.delete(`/cart/${id}`);
        getCart();
        notification(data.message, '', 'warning');
    };

    const goCheckout = async () => {
        // crea la order       
        const { data: id } = await axios.post(`/order/`, selectedAdd);
        // con la id inicia el checkout
        navigate(`/checkout/${id}`);
    };

    const openMP = async () => { 
        setLoadingPayment(true);
        // crea la order       
        const { data: id } = await axios.post(`/order/`, selectedAdd);
        setOrderId(id);
        // crea la preferencia para mp con la order
        const { data }  = await axios.get(`/mercadopago/${id}`);
        // abre el modal de mp con la id de la preferencia
        loadMercadoPago(data.id);
        setLoadingPayment(false);
     };

    return (
        <div className="cart-container">

            <div className="cart-inner">
                <h2 style={{ color: 'black' }}>Cart</h2>
                {(cart && cart.length > 0)
                ? <div className="">
                    
                    {cart.map((p) => (
                        <CartCard
                            key={p.product_id}
                            on_cart={true}
                            on_sale={p.on_sale}
                            img={p.img}
                            name={p.product_name}
                            prodId={p.product_id}
                            price={p.price}
                            sale_price={p.sale_price}
                            free_shipping={p.free_shipping}
                            discount={p.discount}
                            brand={p.brand}
                            deleteP={deleteProduct}
                            prodQuantity={p.quantity}
                            stock={p.stock}
                            />
                    ))}

                    <div className="total-section-container">
                        {selectedAdd
                            ? <div className="total-section-inner">
                                    <div 
                                        onClick={openAddList}
                                        className='cart-address-selector'
                                        name={'address-container'}>
                                            {selectedAdd.street_name+' '+selectedAdd.street_number+', '+selectedAdd.city}
                                        <Arrow className='arrow-address-selector'/>
                                    </div>

                                    <div className="cart-total">
                                    {free_ship_cart 
                                    ? <div className="cart-ship-total green">
                                        <Ship className='ship-svg'/>
                                        <h2>Gratis!</h2>
                                    </div>
                                    : '$300' }
                                </div>

                                </div>
                            : <div className="total-section-inner" >
                                <div 
                                    onClick={openAddForm}
                                    className="cart-address-selector">
                                    <b>You have no address asociated,</b> 
                                    please create one to proceed. 
                                    <Arrow className='arrow-address-selector'/>
                                </div>
                                
                                <div className="cart-total">
                                    {free_ship_cart 
                                    ? <div>
                                        <Ship/>Envío gratis!
                                    </div>
                                    : '$'+SHIP_COST }
                                </div>

                            </div>}

                        <div className="total-section-inner">
                            <h2>Total:</h2>
                            <h2 className="cart-total">${free_ship_cart ? total : total+SHIP_COST}</h2>
                        </div>
                    </div>
                    
                        <div className="cart-button-section">
                            <button disabled={(true || loadingPayment)} 
                            onClick={openMP}>{ loadingPayment 
                            ? <Spinner className='cho-svg'/> 
                            : 'Stripe checkout' }</button>

                            <button disabled={(!cart || cart.length < 1 || !selectedAdd || loadingPayment)} 
                            onClick={goCheckout}>{ loadingPayment 
                            ? <Spinner className='cho-svg'/> 
                            : 'MercadoPago checkout' }</button>
                        </div>
                    
                </div>
                : <h1 style={{ color: 'black'}}>Your cart is empty.</h1>}
            </div>

            <form 
            id='checkout-container'
            method="GET"
            action={`/orders/post-sale/${orderId}`}></form>
            <br />
            <br />
            <br />
            <br />
            <hr />
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

export default Cart;
