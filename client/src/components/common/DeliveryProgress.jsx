import { useLocation } from "react-router-dom";
import { correctStyle } from "../../helpers/correctStyle";
import { deliveryPercent } from "../../helpers/deliveryPercent";
import { formatDate } from "../../helpers/formatDate";
import { ReactComponent as Gift } from "../../assets/svg/gift.svg";
import "./DeliveryProgress.css";

const DeliveryProgress = ({ order }) => {
  const location = useLocation();
  let actualDate = new Date().getTime(-10800000);

  return (
    <div className="delivery-progress-container">
      <p
        className={actualDate < order.delivery_date ? "" : "delivery-finished"}
      >
        {deliveryPercent(order.delivery_date, order.payment_date).state}
      </p>
      <div className="delivery-container">
        <div className="delivery-inner">
          <div
            className="delivery-bar"
            style={correctStyle(
              order.flash_shipping,
              deliveryPercent(order.delivery_date, order.payment_date).percent
            )}
          >
            {order.flash_shipping ? (
              <div className="ship-gradient delivery-pointer"></div>
            ) : (
              <div>
                <Gift className="delivery-pointer" />
              </div>
            )}
            <div className="delivery-pointer-back"></div>
          </div>
        </div>
      </div>
      {location.pathname !== "/profile/orders" && (
        <>
          <p>Dirección de envío:</p>
          <b>{`${order?.shipping_address.street_name} ${order?.shipping_address.street_number}, ${order?.shipping_address.city}, ${order?.shipping_address.state}`}</b>
        </>
      )}

      <p>
        {" "}
        {actualDate < order.delivery_date ? "Llega el " : "Llegó el "}
        <b>{formatDate(order.delivery_date)}</b>
      </p>
    </div>
  );
};

export default DeliveryProgress;
