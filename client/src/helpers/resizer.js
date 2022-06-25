export const resizer = (url, size = 96) => {
    if (!url) return 'https://cdn.drawception.com/drawings/aSPjXhJbbr.png'
    let resize = `h_${size},w_${size},c_limit/`;
    return url.replace(/v[0-9]*\//g, resize);
};