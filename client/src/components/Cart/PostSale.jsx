import axios from 'axios'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import { loadCart } from '../../Redux/reducer/cartSlice';
import './PostSale.css';

import LoaderBars from '../common/LoaderBars';
import DeliveryProgress from '../common/DeliveryProgress';

const PostSale = () => {
    const [order, setOrder] = useState(false)
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [params] = useSearchParams(),
    id = params.get('external_reference');
    let status = params.get('status') ?? 'cancelled';
    
    useEffect(() => {
        (async () => {
            if (status === 'null' || status === 'cancelled') return navigate('/');

            const { data } = await axios(`/order/${id}`);
            console.log(data);
            setOrder(data);
            setLoading(false)
            
            if (status === 'approved') {
                if (data.order_type === 'cart') {
                    //? vaciar carrito
                    await axios.delete(`/cart/empty`);
                    
                    //? Vaciar el estado de redux onCart
                    dispatch(loadCart([]));
                    
                    //? Quitar last_order en el carrito de la db
                    await axios.put(`/cart/order/`);
                } else {
                    //? vaciar el buynow
                    axios.post(`/cart/`, {product_id: ''});
                }
                //? Cambiar el estado a 'processing'
                await axios.put(`/order/${id}`,{
                    status: 'processing'
                });
                //? en el back:
                // cambiar orden a pagada    
                // restar unidades de cada stock
            };
            if (status !== 'approved' && data.status !== 'approved') {
                //? cambiar estado de la orden si el status no es aprobado en ninguno de los casos
                await axios.put(`/order/${id}`,{
                    status
                });
            }
        })()
      // eslint-disable-next-line
    }, [])

    const messageQuantity = () => {
        if (order.products.length === 1) {
            if (order.products[0].quantity > 1) {
                return 'Los productos ya son tuyos!'
            } else {
                return 'El producto ya es tuyo!'
            }
        } 

        return 'Los productos ya son tuyos!'        
     };     
    
    return (
        <div className='postsale-container'>
            <h1>Post Venta</h1>
            { (loading && !order )
                ? <LoaderBars />
                : <div className='postsale-inner'>
                    <div className='postsale-header'>
                        {order?.products.map(e =>(
                            <img src={resizer(e.img)} 
                            alt="product"
                            key={e.product_id}
                            style={{ height: '96px'}}/>
                        ))}
                    </div>
                    <div className="postsale-details-container">
                        {status === 'approved' && <div>
                            <h1>PERFECTO!</h1>
                            <h3>{messageQuantity()}</h3>
                            <h3>Ahora estamos preparando el envío.</h3>
                        </div>}
                        {/* <p>Resumen: {order?.description}</p> */}
                        {order.delivery_date && (
                            <DeliveryProgress order={order}/>
                        )}
                        <p>{`Estado del pago: ${status}`}</p>
                        <p>Medio de pago: {order.payment_source}</p>
                        <p>Id de orden: <i>{order?.id}</i></p>
                    </div>
                </div>}
        </div>
    )
}

export default PostSale