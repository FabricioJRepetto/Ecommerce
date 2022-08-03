import axios from 'axios'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import { loadCart } from '../../Redux/reducer/cartSlice';

const PostSale = () => {
    const [order, setOrder] = useState(false)
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [params] = useSearchParams(),
    id = params.get('external_reference');
    let status = params.get('status') ?? 'cancelled'
    
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