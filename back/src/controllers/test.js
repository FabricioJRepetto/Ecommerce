const axios = require('axios')

const test = async (req, res, next) => { 
    try {
        const { data } = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?category=MLA454379&limit=20`)
        res.json(data.results)

    } catch (error) {
        next(error)
    }
 }

module.exports = {
    test
}