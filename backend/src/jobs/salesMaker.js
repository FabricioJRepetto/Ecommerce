
const Product = require('../models/product');
const Sales = require('../models/Sales');
const { random } = require('../utils/random');

const salesMaker = async () => { 
    const discounts = [25, 30, 50, 35, 40];

    try {
        const products = await Product.find();
        const available = products.filter(e => !e.on_sale);
    
        const indx = await random(available.length, 5);
    
        let new_ids = [];
        let nombres = [];
    
        // setea las ofertas
        for (let i = 0; i < 5; i++) {
            let current = available[indx[i]];
            new_ids.push(current.id);
            nombres.push(current.name);
    
            await Product.findByIdAndUpdate(current.id, {
            '$set': {
                    'on_sale': true,
                    'discount': discounts[i],
                    'free_shipping': true
                }
            })
        };
    
        const sales = await Sales.findOne();
        // quita las ofertas anteriores
        await Product.updateMany({_id: {$in: sales.products}},
            {
                '$set': {
                    'on_sale': false,
                    'discount': 0,
                    'free_shipping': false
                }
            }
        );
        // guarda las id nuevas
        sales.products = new_ids;
        sales.last_update = Date.now()
        await sales.save();

        return sales;
    } catch (error) {
        next(error)
    }
 }

 module.exports = { 
    salesMaker 
};