export const priceFormat = (price) => {
    if (!price && price !== 0) return { int: 'xxx', cents: 'xx' }
    if (price === 0) return { int: '0', cents: '00' }
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