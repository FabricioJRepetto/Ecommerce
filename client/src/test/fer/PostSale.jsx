import axios from 'axios'
import { useState } from 'react';
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import { useAxios } from '../../hooks/useAxios';

const { REACT_APP_MP_SKEY } = process.env;

const PostSale = () => {
    const [orderStatus, setOrderStatus] = useState();
    const { id } = useParams();

    const { data, loading, error } = useAxios('GET', `/order/${id}`);
    
    useEffect(() => {
        //! CAMBIAR PARA EL DEPLOY
        //! solo pedir la order al back para mostrar detalles

        //: peticion a mp para saber status del pago
        (async () => {
            const { data } = await axios.get(`https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=${id}`, {
                headers: {
                    Authorization: `Bearer ${REACT_APP_MP_SKEY}`,
                }
            });
            console.log(data.results[0].status);
            setOrderStatus(data.results[0].status);

            if (data.results[0].status === 'approved') {
                //? cambiar orden a pagada
                const { data: orderUpdt } = await axios.put(`/order/${id}`,{
                    status: 'approved'
                });
                console.log(orderUpdt);
    
                //? vaciar carrito
                const { data: cartEmpty } = await axios.delete(`/cart/empty`);
                console.log(cartEmpty.message);
    
                //? restar unidades de cada stock
                const { data: order } = await axios(`/order/${id}`);
                let list = order.products.map(e => ({id: e.product_id, amount: e.quantity}));
                const { data: stockUpdt } = await axios.put(`/product/stock/`, list);
                console.log(stockUpdt);
            };
        })();
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