export const resizer = (url, size = 96, crop = true) => {
    let resize = `h_${size},w_${size},${crop ? 'c_fill' : 'c_limit'}/`;
    return url.replace(/v[0-9]*\//g, resize);
};