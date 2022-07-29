const CronJob = require('cron').CronJob;
const order = require('../models/order');

const deliveryGuy = async () => {
    const orders = await order.find({ delivery_status: 'shipping' });
    let deliveries = 0;

    for (const o of orders) {
        if ((Date.now()) - new Date(o.delivery_date) >= 0) {
            deliveries += 1;
            await order.findByIdAndUpdate(o._id, {
                '$set': {
                    delivery_status: 'dispatched'
                }
            })
        };
    };
    console.log(`// ${deliveries || 'No'} packages delivered.`);
};

const deliveryUpdater = new CronJob('0 1 15 * * *', function () {
    console.log(`// Sending the delivery guy...`);
    deliveryGuy();
},
    null,
    false,
    'America/Sao_Paulo'
);

module.exports = {
    deliveryGuy,
    deliveryUpdater
}