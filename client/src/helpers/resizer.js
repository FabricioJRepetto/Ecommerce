export const resizer = (url, size = 96) => {
    let resize = `h_${size},c_scale/`;
    return url.replace(/v[0-9]*\//g, resize);
};