const expirationChecker = (expDate) => {
    console.log(((Date.now()) - new Date(expDate)))
    if ((Date.now()) - new Date(expDate) > 0) return true;
    return false;
}

module.exports = expirationChecker;