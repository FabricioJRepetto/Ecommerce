const axios = require('axios')

const test = async (req) => { 
    try {
        const { data } = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?category=MLA454379&limit=20`)
        return data.results

    } catch (error) {
        return error
    }
 }

module.exports = {
    test
}