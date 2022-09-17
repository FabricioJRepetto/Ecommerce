export const toRGB = (code) => {
    // if (code.length !== 6) {
    //     throw Error("Only six-digit hex colors are allowed.");
    // }

    var aRgbHex = code.slice(1).match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    return aRgb.join(', ');
}