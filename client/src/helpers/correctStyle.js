export const correctStyle = (flash, percent) => {
  if (flash) {
    return {
      width: percent + "%",
      background:
        percent < 100
          ? "linear-gradient(45deg,#35a7ff 0%,#7e54de 20%,#f40259 60%,#fea30d 100%)"
          : "green",
      backgroundSize: "400%",
      animation: "gradientTextAnim 5s infinite",
    };
  }

  return {
    width: percent + "%",
    background: percent < 100 ? "white" : "green",
  };
};
