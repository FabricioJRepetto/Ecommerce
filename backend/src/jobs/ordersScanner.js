const CronJob = require('cron').CronJob;
const Orders = require('../models/order');

const scanner = async () => {
    try {
        const list = await Orders.find({ status: 'pending' })

    } catch (error) {
        return error
    }
};

const ordersScanner = new CronJob('0 0 0 * * *', function () {
    scanner();
    console.log('// Scanning for expired orders.');
},
    null,
    false,
    'America/Sao_Paulo'
);

module.exports = {
    scanner,
    ordersScanner
}