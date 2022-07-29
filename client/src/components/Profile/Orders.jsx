import React from 'react';
import { formatDate } from '../../helpers/formatDate';
import { resizer } from '../../helpers/resizer';
import { useAxios } from '../../hooks/useAxios';
import axios from 'axios';
import { useNotification } from '../../hooks/useNotification';
import { notificationSlice } from '../../Redux/reducer/notificationSlice';


const Orders = () => {
    const [notification] = useNotification();
    const { data: orders, loading } = useAxios("GET", `/order/userall/`);

    const percent = (date, start) => { 
        let total = date - start;
        let progress = date - Date.now();
        let percent = Math.floor(100 - ((progress * 100) / total));

        let state = '';
        switch (percent) {
            case percent > 10 && percent <= 30:
                state = 'dispatching';
                break;
            case percent > 30 && percent <= 70:
                state = 'Ready to deliver';
                break;
            case percent > 70 && percent < 100:
                state = 'Ready to deliver';
                break;
            case percent === 100:
                state = 'Ready to deliver';
                break;
            default: state = 'geting your package ready';
                break;
        }

        return {percent, state};
    }

    const cancelOrder = async (id) => { 
        const { data } = await axios.put(`/order/${id}`, {status: 'cancelled'});
        notification(data.message, '', 'warning')
    }

  return (
    <div>
        <h2>Orders</h2>
        {!loading ? (
        <div className="profile-orders-container">
            {orders?.length ? (
            React.Children.toArray(
                orders?.map((e) => (
                <div className="profile-img-orders-container" key={e.id}>
                    {e.products?.map((pic) => (
                    <img
                        key={pic.img}
                        src={resizer(pic.img)}
                        alt={"product"}
                    />
                    ))}
                    <p>{e.description}</p>
                    <p>creation date: {formatDate(e.expiration_date_from)}</p>
                    {e.status === 'pending' && `expiration: ${formatDate(e.expiration_date_to)}`}
                    <p>- - -</p>
                    <p>payment status: {e.status}</p>
                    {e.status === 'approved' && <p>payment date: {formatDate(e.payment_date)}</p>}
                    {e.status === 'pending' && e.payment_link && <div><a style={{ color: '#3483fa'}} href={e.payment_link}>Continue payment.</a></div>}
                    {e.status === 'pending' && <button onClick={()=> cancelOrder(e._id)}>Cancel order</button>}
                    <p>{e.payment_source}</p>
                    <p>order id: <i>{e.id}</i></p>
                    {e.delivery_date && <div>
                        <p>- - -</p>
                        <p>{percent(e.delivery_date, e.created_at).state}</p>
                        <div className='delivery-container'>
                            <div className='delivery-inner'>
                                <div style={{width: percent(e.delivery_date, e.created_at).percent+'%'}}></div>
                            </div>
                            {
                            //! volver aver BORRAR ESTE PORCENTAJE 
                            }
                            <p>{percent(e.delivery_date, e.created_at).percent+'%'}</p>
                        </div>
                        <p>delivery ETA: {formatDate(e.delivery_date)}</p>
                    </div>}
                    <p>- - -</p>
                    <p>
                    shipping address:{" "}
                    {`
                            ${e.shipping_address?.street_name} 
                            ${e.shipping_address?.street_number}, 
                            ${e.shipping_address?.city} 
                        `}
                    </p>
                    <p>free shipping: {e.free_shipping ? "Yes" : "No"}</p>
                    <p>shipping cost: {e.shipping_cost}</p>
                    <p>total payment: ${e.total}</p>
                    <hr />
                    <br />
                </div>
                ))
            )
            ) : (
            <p>No orders yet</p>
            )}
        </div>
        ) : (
        <p>LOADING</p>
        )}
    </div>
  )
}

export default Orders