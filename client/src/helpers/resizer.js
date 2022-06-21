export const resizer = (url) => {
    let resize = 'h_96,c_scale/';
    return url.replace(/v[0-9]*\//g, resize);
};