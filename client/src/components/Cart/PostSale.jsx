import axios from 'axios'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import { loadCart } from '../../Redux/reducer/cartSlice';

const PostSale = () => {
    const [order, setOrder] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [params] = useSearchParams(),
    id = params.get('external_reference');
    let status = params.get('status') ?? 'canceled'
    
    useEffect(() => {
        //! CAMBIAR PARA EL DEPLOY
        // solo pedir la order al back para mostrar detalles
        // mp y stripe avisan el status del pago por query
        // pero tienen que hacerlo notificando al back

        firstLoad && (async () => {
            if (status === 'null' || status === 'canceled') return navigate('/');

            const { data } = await axios(`/order/${id}`);
            console.log(data);
            setOrder(data);
            
            if (status === 'approved' && data.status !== 'approved') {
                if (data.order_type === 'cart') {
                    //? vaciar carrito
                    const { data: cartEmpty } = await axios.delete(`/cart/empty`);
                    console.log(cartEmpty.message);
                    //? Vaciar el estado de redux onCart
                    dispatch(loadCart([]));
                    console.log('Estado actualizado');
                    //? Quitar last_order en el carrito de la db
                    const { data: cartOrder } = await axios.put(`/cart/order/`);
                    console.log(cartOrder.message);
                } else {
                    //? vaciar el buynow
                    axios.post(`/cart/`, {product_id: ''});
                    console.log('buynow reseted');
                }

                //? cambiar orden a pagada
                const orderUpdt = await axios.put(`/order/${id}`,{
                    status: 'approved'
                });
                console.log(orderUpdt.data.message);    
    
                //? restar unidades de cada stock
                let list = data.products.map(e => ({id: e.product_id, amount: e.quantity}));
                const { data: stockUpdt } = await axios.put(`/product/stock/`, list);
                console.log(stockUpdt);

                //! first load solo sirve pre deploy
                setFirstLoad(false);
                setLoading(false);
            };
            if (status !== 'approved' && data.status !== 'approved') {
                //? cambiar stado de la orden
                const orderUpdt = await axios.put(`/order/${id}`,{
                    status
                });
                console.log(orderUpdt.data.message);

                //! first load solo sirve pre deploy
                setFirstLoad(false);
                setLoading(false);
            }
        })()
      // eslint-disable-next-line
    }, [])
    
    return (
        <div>
            <h1>Post Venta</h1>
            { (loading && !order )
                ? <p>LOADING · · ·</p>
                : <>
                    <div >
                        {order?.products.map(e =>(
                            <img src={resizer(e.img)} 
                            alt="product"
                            key={e.product_id}
                            style={{ height: '96px'}}/>
                        ))}
                    </div>
                    <p>{`Estado de la orden: ${status}`}</p>
                    <p><i>{order?.id}</i></p>
                    <p>{order?.description}</p>
                    <p><i>shipping info</i></p>
                    <p>{`${order?.shipping_address.street_name} ${order?.shipping_address.street_number}, ${order?.shipping_address.city}, ${order?.shipping_address.state}.`}</p>
            </>}
        </div>
    )
}

export default PostSale