const meliParser = (results) => {
    const disc = (original, price) => {
        return (100 - Math.round((price / original) * 100))
    }
    const discPrice = (original, price) => {
        let discount = (100 - Math.round((price / original) * 100));
        return Math.round(original * (1 - (discount / 100)))
    }

    let aux = results.map(e => ({
        _id: e.id,
        name: e.title,
        thumbnail: `https://http2.mlstatic.com/D_NQ_NP_${e.thumbnail_id}-V.jpg`,
        price: e.original_price ? e.original_price : e.price,
        on_sale: e.original_price ? true : false,
        discount: e.original_price ? disc(e.original_price, e.price) : 0,
        sale_price: e.original_price ? discPrice(e.original_price, e.price) : 0,
        free_shipping: e.shipping.free_shipping,
        brand: e.attributes.find(e => e.id === 'BRAND')?.value_name || ''
    }))

    return aux;
};

module.exports = {
    meliParser
}