
const Product = require('../models/product');
const Sales = require('../models/Sales');
const { random } = require('../utils/random');

const salesMaker = async () => {
    const discounts = [25, 30, 50, 35, 40];
    try {
        // quita las ofertas anteriores
        const sales = await Sales.findOne();
        await Product.updateMany({ _id: { $in: sales.products } },
            {
                '$set': {
                    'on_sale': false,
                    'discount': 0,
                    'free_shipping': false
                }
            }
        );

        const products = await Product.find();
        const available = products.filter(e => !e.on_sale);

        const indx = random(available.length - 1, 5);
        console.log(indx);

        let new_ids = [];
        let nombres = [];
        // setea las ofertas
        for (let i = 0; i < 5; i++) {
            let aux = available;
            available.length < 5 && (aux = products)

            let current = aux[indx[i]];
            new_ids.push(current.id);
            nombres.push(current.name);

            (async () => await Product.findByIdAndUpdate(current.id, {
                '$set': {
                    'on_sale': true,
                    'discount': discounts[i],
                    'free_shipping': true
                }
            }))()
        };
        console.log(nombres);

        // guarda las id nuevas
        sales.products = new_ids;
        sales.last_update = Date.now()
        await sales.save();

        console.log(sales);

        return sales;
    } catch (error) {
        return error
    }
}

module.exports = {
    salesMaker
};