const random = async (max, amount) => {
    let aux = [];
    for (let i = 0; i < amount; i++) {
        let num = Math.floor(Math.random() * max);
        if (!aux.includes(num)) {
            aux.push(num);
        } else {
            i -= 1
        }
    }
    return aux;
};

module.exports = {
    random
}