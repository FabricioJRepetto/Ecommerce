import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import { cartTotal, mainMinus } from "../../Redux/reducer/cartSlice";
import QuantityInput from "./QuantityInput";
import { loadMercadoPago } from "../../helpers/loadMP";
import { resizer } from "../../helpers/resizer";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [orderId, setOrderId] = useState('');
    const [address, setAddress] = useState(null);
    const [newAdd, setNewAdd] = useState({});
    const [selectedAdd, setSelectedAdd] = useState(null);
    const total = useSelector((state) => state.cartReducer.total);
    const [isOpen, openModal, closeModal, prop] = useModal();
    const [isOpenAddForm, openAddForm, closeAddForm] = useModal();
    const [isOpenAddList, openAddList, closeAddList] = useModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getCart();
        getAddress();
    // eslint-disable-next-line    
    }, [])

    const getCart = async () => {
        const { data } = await axios('/cart/');
        typeof data !== 'string' && setCart(data.products);
        dispatch(cartTotal(data.total));
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
        await axios.delete(`/cart/${id}`);
        getCart();
        dispatch(mainMinus());
        closeModal();
    };

    const goCheckout = async () => {
        // crea la order       
        const { data: id } = await axios.post(`/order/`, selectedAdd);
        // con la id inicia el checkout
        navigate(`/checkout/${id}`);
    };

    const openMP = async () => { 
        // crea la order       
        const { data: id } = await axios.post(`/order/`, selectedAdd);
        setOrderId(id);
        // crea la preferencia para mp con la order
        const { data }  = await axios.get(`/mercadopago/${id}`);
        // abre el modal de mp con la id de la preferencia
        loadMercadoPago(data.id);
     };

    return (
        <div >            
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <h1>Remove this product from the cart?</h1>
                <div>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={() => deleteProduct(prop)}>Delete</button>
                </div>
            </Modal>
            
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

            <hr />
            <h2>Cart</h2>
            <br />
            {(cart && cart.length > 0)
            ? <div> 
                {cart.map((prod) => (
                    <div key={prod.product_id}>
                        <img src={resizer(prod.img)} alt='product img' />
                            {prod.product_name} - ${prod.price} - 
                                <QuantityInput prodId={prod.product_id} prodQuantity={prod.quantity}
                                stock={prod.stock} 
                                price={prod.price}
                            />
                            <p onClick={()=> openModal(prod.product_id)}><b> Delete </b></p>
                    </div>
                ))}
                <h2>{`Total: ${total}`}</h2>
                <br/>
                <div>
                    <p><b>Shipping address:</b></p>
                    {selectedAdd
                        ? <div>
                            <div name={'address-container'}>{selectedAdd.street_name+' '+selectedAdd.street_number+', '+selectedAdd.city}</div>
                                <button onClick={openAddList}>Select another address</button>
                            </div>
                        : <div>
                            <p><b>You have no address asociated,</b> 
                            please create one to proceed.</p>
                            <button onClick={openAddForm}>Create address</button>
                        </div>}
                </div>
            </div>
            : <h1>your cart is empty</h1>
            }
            <br />
            <br />
            <button disabled={(!cart || cart.length < 1 || !selectedAdd) && true } 
            onClick={goCheckout}> Stripe checkout </button>
            <br />
            <button disabled={(!cart || cart.length < 1 || !selectedAdd) && true } 
            onClick={openMP}> MercadoPago checkout </button>
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
                <p><b>stripe</b></p>
                <li><p>card: <i>4242 4242 4242 4242</i></p></li>
                <li><p>expiration: <i>fecha mayor a la actual</i></p></li>
                <li><p>cvc: <i>123</i></p></li>
                <br/>
                <p><b>mercadopago</b></p>
                <li><p>card: <i>5416 7526 0258 2580</i></p></li>
                <li><p>expiration: <i>11/25</i></p></li>
                <li><p>cvc: <i>123</i></p></li>
                <li><p>nombre: <i>APRO</i></p></li>
                <li><p>dni: <i>12345678</i></p></li>
            </ul>
        </div>
    );
};

export default Cart;
