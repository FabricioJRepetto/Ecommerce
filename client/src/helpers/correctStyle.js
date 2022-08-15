import { deliveryPercent } from "./deliveryPercent";

export const correctStyle = (order) => {
    if (order.flash_shipping) {
        return {
            width: deliveryPercent(order.delivery_date, order.created_at).percent + "%",
            background: 'linear-gradient(45deg,#35a7ff 0%,#7e54de 20%,#f40259 60%,#fea30d 100%)',
            backgroundSize: '400%',
            animation: 'gradientTextAnim 5s infinite'
        }
    }

    return {
        width: deliveryPercent(order.delivery_date, order.created_at).percent + "%",
        background: 'green'
    };
}