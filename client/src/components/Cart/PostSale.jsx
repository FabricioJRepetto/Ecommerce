import axios from 'axios'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import { loadCart } from '../../Redux/reducer/cartSlice';
import { deliveryPercent } from '../../helpers/deliveryPercent';
import { formatDate } from '../../helpers/formatDate';
import './PostSale.css';

import LoaderBars from '../common/LoaderBars';
import { ReactComponent as Gift } from '../../assets/svg/gift.svg';
import { correctStyle } from '../../helpers/correctStyle';

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
                            <div className='delivery-progress-container'>
                                <p>{deliveryPercent(order.delivery_date, order.created_at).state}</p>
                                <div className="delivery-container">
                                    <div className="delivery-inner">
                                        <div className='delivery-bar'
                                            style={ correctStyle(order) }
                                        >{order.flash_shipping ? <div className='ship-gradient delivery-pointer'></div> : <div><Gift className='delivery-pointer'/></div>}<div className='delivery-pointer-back'></div></div>
                                    </div>
                                    {
                                    //! volver a ver: BORRAR ESTE PORCENTAJE
                                    }
                                    <p>
                                    {deliveryPercent(order.delivery_date, order.created_at).percent + "%"}
                                    </p>
                                </div>
                                <p>Fecha estimada de llegada: {formatDate(order.delivery_date)}</p>
                                <p>{`Dirección de envío: ${order?.shipping_address.street_name} ${order?.shipping_address.street_number}, ${order?.shipping_address.city}, ${order?.shipping_address.state}.`}</p>
                            </div>
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