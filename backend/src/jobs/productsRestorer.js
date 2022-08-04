const CronJob = require('cron').CronJob;
const product = require('../models/product')

const restorer = async () => {
    // borrar 
    let ogProducts = [];
    await product.deleteMany('');

    for (const product of ogProducts) {
        await product.create(product);
    };

    return '// Products restored';
};

const productsRestorer = new CronJob('0 55 23 * * *', async function () {
    console.log(`// Restoring products...`);
    let log = await restorer();
    console.log(log);
},
    null,
    false,
    'America/Sao_Paulo'
);

module.exports = {
    restorer,
    productsRestorer
}