import axios from 'axios'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import { useAxios } from '../../hooks/useAxios';
import { loadCart } from '../../Redux/reducer/cartSlice';

const { REACT_APP_MP_SKEY } = process.env;

const PostSale = () => {
    const [orderStatus, setOrderStatus] = useState();
    const [firstLoad, setFirstLoad] = useState(true)
    const dispatch = useDispatch();
    
    const [params] = useSearchParams();
    const id = params.get('id');
    const success = params.get('success');

    const { data, loading, error } = useAxios('GET', `/order/${id}`);
    
    useEffect(() => {
        //! CAMBIAR PARA EL DEPLOY
        //! solo pedir la order al back para mostrar detalles

        firstLoad && (async () => {
            // si no hay respuesta de stripe
            //! peticion a mp para saber status del pago
            if (success === null) {
                const { data: MP } = await axios.get(`https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=${id}`, {
                    headers: {
                        Authorization: `Bearer ${REACT_APP_MP_SKEY}`,
                    }
                });
                console.log(MP.results[0].status);
                setOrderStatus(MP.results[0].status);
            } else {
                setOrderStatus(success ? 'approved' : 'cenceled');
            }

            const { data: order } = await axios(`/order/${id}`);

            if (orderStatus === 'approved' && order.status !== 'approved') {

                if (order.order_type === 'cart') {
                    //? vaciar carrito
                    const { data: cartEmpty } = await axios.delete(`/cart/empty`);
                    console.log(cartEmpty.message);
                    //? Vaciar el estado de redux onCart
                    dispatch(loadCart([]));
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
                //: crear un virtual para ids de order ?
                
                let list = order.products.map(e => ({id: e.product_id, amount: e.quantity}));
                const { data: stockUpdt } = await axios.put(`/product/stock/`, list);
                console.log(stockUpdt);

                //! first load solo sirve pre deploy
                setFirstLoad(false);                
            };
        })()
      // eslint-disable-next-line
    }, [])
    
    return (
        <div>
            <h1>Post Venta</h1>
            {error && <h1>{error}</h1>}
            { (loading && !orderStatus )
                ? <p>LOADING · · ·</p>
                : <>
                    <div >
                        {data?.products.map(e =>(
                            <img src={resizer(e.img)} 
                            alt="product"
                            key={e.product_id}/>
                        ))}
                    </div>
                    <p>{`Estado de la orden: ${orderStatus}`}</p>
                    <p><i>{data?.id}</i></p>
                    <p>{data?.description}</p>
                    <p><i>shipping info</i></p>
                    <p>{`${data.shipping_address.street_name} ${data.shipping_address.street_number}, ${data.shipping_address.city}, ${data.shipping_address.state}.`}</p>
            </>}
        </div>
    )
}

export default PostSale