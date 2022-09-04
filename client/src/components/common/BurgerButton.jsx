import "./BurgerButton.css";

const BurgerButton = ({ setShowMenu, showMenu }) => {
  return (
    <label className="hamburger" onClick={() => setShowMenu(!showMenu)}>
      <span
        className={`hamburger-top-bread${
          showMenu ? " hamburger-top-bread-open" : ""
        }`}
      ></span>
      <span
        className={`hamburger-patty${showMenu ? " hamburger-patty-open" : ""}`}
      ></span>
      <span
        className={`hamburger-bottom-bread${
          showMenu ? " hamburger-bottom-bread-open" : ""
        }`}
      ></span>
    </label>
  );
};

export default BurgerButton;
