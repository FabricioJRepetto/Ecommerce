const { rawIdProductGetter } = require('./rawIdProductGetter');
const Order = require('../models/order');
const Cart = require('../models/cart');

const cartFormater = async (cart) => {
    let promises = [];
    for (const id of cart.products) {
        promises.push(rawIdProductGetter(id.product_id))
    }
    let promisesB = [];
    for (const id of cart.buyLater) {
        promisesB.push(rawIdProductGetter(id.product_id))
    }
    const data = await Promise.allSettled(promises);

    let products = [],
        buyLater = [],
        id_list = [],
        total = 0,
        free_ship_cart = false,
        shipping_cost = 0,
        message = false,
        last_order = cart.last_order;

    if (last_order) {
        const order = await Order.findById(cart.last_order);
        if (order.status !== 'pending') {
            last_order = false;
            Cart.findByIdAndUpdate(
                cart.id,
                { last_order: '' }
            )
        }
    }

    const quantityGetter = (id, source) => {
        let { quantity } = cart[source].find(e => e.product_id === id)
        return quantity
    }

    data.forEach(p => {
        if (p.status === 'fulfilled') {
            products.push({
                _id: p.value._id.toString(),
                name: p.value.name,
                free_shipping: p.value.free_shipping,
                discount: p.value.discount,
                brand: p.value.brand,
                price: p.value.price,
                sale_price: p.value.sale_price,
                on_sale: p.value.on_sale,
                stock: p.value.available_quantity,
                thumbnail: p.value.thumbnail,
                description: p.value.description,
                quantity: quantityGetter(p.value._id.toString(), 'products')
            });
            id_list.push(p.value._id.toString());

            total += (p.value.on_sale ? p.value.sale_price : p.value.price) * quantityGetter(p.value._id.toString(), 'products');

            p.value.free_shipping ? (free_ship_cart = true) : shipping_cost += SHIP_COST;
        }
    });

    const dataB = await Promise.allSettled(promisesB);
    dataB.forEach(p => {
        if (p.status === 'fulfilled') {
            buyLater.push({
                _id: p.value._id.toString(),
                name: p.value.name,
                free_shipping: p.value.free_shipping,
                discount: p.value.discount,
                brand: p.value.brand,
                price: p.value.price,
                sale_price: p.value.sale_price,
                on_sale: p.value.on_sale,
                stock: p.value.available_quantity,
                thumbnail: p.value.thumbnail,
                description: p.value.description,
                quantity: quantityGetter(p.value._id.toString(), 'buyLater')
            });
        }
    });

    if (cart.products.length !== id_list.length) {
        cart.products = cart.products.filter(e => id_list.includes(e.product_id));
        await cart.save();
        message = 'Some products are not available. Cart updated.';
    }

    return ({
        message,
        products,
        buyLater,
        buyNow: cart.buyNow,
        id_list,
        total,
        free_ship_cart,
        shipping_cost,
        last_order
    });
};

module.exports = {
    cartFormater
}