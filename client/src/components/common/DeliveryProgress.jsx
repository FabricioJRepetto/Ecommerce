import React from 'react';
import { correctStyle } from '../../helpers/correctStyle';
import { deliveryPercent } from '../../helpers/deliveryPercent';
import { formatDate } from '../../helpers/formatDate';
import { ReactComponent as Gift } from "../../assets/svg/gift.svg";

const DeliveryProgress = ({ order }) => {

  return (
    <div className='delivery-progress-container'>
        <p>{deliveryPercent(order.delivery_date, order.created_at).state}</p>
        {
            //! volver a ver: BORRAR ESTE PORCENTAJE
        }
        <p>
        {deliveryPercent(order.delivery_date, order.created_at).percent + "%"}
        </p>
        <div className="delivery-container">
            <div className="delivery-inner">
                <div className='delivery-bar'
                    style={ correctStyle(order) }
                >{order.flash_shipping ? <div className='ship-gradient delivery-pointer'></div> : <div><Gift className='delivery-pointer'/></div>}<div className='delivery-pointer-back'></div></div>
            </div>            
        </div>
        <p>Fecha estimada de llegada: {formatDate(order.delivery_date)}</p>
        <p>{`Dirección de envío: ${order?.shipping_address.street_name} ${order?.shipping_address.street_number}, ${order?.shipping_address.city}, ${order?.shipping_address.state}.`}</p>
    </div>
  )
}

export default DeliveryProgress