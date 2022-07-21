export const resizer = (url, size = 96) => {
    let resize = `h_${size},w_${size},c_limit/`
    return url.replace(/v[0-9]*\//g, resize);
};

export const avatarResizer = (url) => {

    return url.replace('dsyjj0sch/image/upload/', 'dsyjj0sch/image/upload/w_100,c_fill,ar_1:1,g_auto,b_rgb:000000/')
}