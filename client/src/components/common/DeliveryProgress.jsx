import React from 'react';
import { correctStyle } from '../../helpers/correctStyle';
import { deliveryPercent } from '../../helpers/deliveryPercent';
import { formatDate } from '../../helpers/formatDate';
import { ReactComponent as Gift } from "../../assets/svg/gift.svg";

const DeliveryProgress = ({ order }) => {

  return (
    <div className='delivery-progress-container'>
        <p>{deliveryPercent(order.delivery_date, order.payment_date).state}</p>
        <p>{deliveryPercent(order.delivery_date, order.payment_date).percent}%</p>
        <div className="delivery-container">
            <div className="delivery-inner">
                <div className='delivery-bar'
                    style={ correctStyle(order.flash_shipping, deliveryPercent(order.delivery_date, order.payment_date).percent) }
                >{order.flash_shipping ? <div className='ship-gradient delivery-pointer'></div> : <div><Gift className='delivery-pointer'/></div>}<div className='delivery-pointer-back'></div></div>
            </div>            
        </div>
        <p>Dirección de envío:</p>
        <b>{`${order?.shipping_address.street_name} ${order?.shipping_address.street_number}, ${order?.shipping_address.city}, ${order?.shipping_address.state}.`}</b>

        <p>Fecha estimada de llegada:</p>
        <b>{formatDate(order.delivery_date)}</b>
    </div>
  )
}

export default DeliveryProgress;

/* 
    created_at:
    new Date(1660608496901)

    payment_date:
    new Date(1660606724194)

    delivery_date:
    new Date(1660932000000)
*/