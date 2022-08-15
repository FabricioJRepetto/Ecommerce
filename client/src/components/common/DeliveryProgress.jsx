import React from 'react';
import { correctStyle } from '../../helpers/correctStyle';
import { deliveryPercent } from '../../helpers/deliveryPercent';
import { formatDate } from '../../helpers/formatDate';
import { ReactComponent as Gift } from "../../assets/svg/gift.svg";

const DeliveryProgress = ({ order }) => {

  return (
    <div className='delivery-progress-container'>
        <p>{deliveryPercent(order.delivery_date, order.created_at).state}</p>
        <div className="delivery-container">
            <div className="delivery-inner">
                <div className='delivery-bar'
                    style={ correctStyle(order) }
                >{order.flash_shipping ? <div className='ship-gradient delivery-pointer'></div> : <div><Gift className='delivery-pointer'/></div>}<div className='delivery-pointer-back'></div></div>
            </div>            
        </div>
        <p>Fecha estimada de llegada:</p>
        <b>{formatDate(order.delivery_date)}</b>
        
        <p>Dirección de envío:</p>
        <b>{`${order?.shipping_address.street_name} ${order?.shipping_address.street_number}, ${order?.shipping_address.city}, ${order?.shipping_address.state}.`}</b>
    </div>
  )
}

export default DeliveryProgress