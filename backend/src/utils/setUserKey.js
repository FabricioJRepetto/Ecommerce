const setUserKey = (isGoogleUser) => {
  if (isGoogleUser) {
    return "googleUser";
  } else {
    return "user";
  }
};

module.exports = setUserKey;
