export const priceFormat = (price) => {
    if (!price) return { int: 'xxx', cents: 'xx' }
    const p = price.toString();
    let cents = p.split('.')[1] || false;
    let int = p.split('.')[0];
    if (int.length > 3) {
        int = int.slice(0, -3) + '.' + int.slice(-3)
    } if (int.length > 7) {
        int = int.slice(0, -7) + '.' + int.slice(-7)
    } if (cents.length < 2) {
        cents = cents + 0
    }
    return { int, cents }
}