export const resizer = (url, size = 96) => {
    let resize = `h_${size},w_${size},c_limit/`
    return url.replace(/v[0-9]*\//g, resize);
};