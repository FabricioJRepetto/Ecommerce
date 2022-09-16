import "./FunnelButton.css";

const FunnelButton = ({ setShowMenu, showMenu }) => {
  return (
    <label className="funnel" onClick={() => setShowMenu(!showMenu)}>
      <span
        className={`funnel-top${showMenu ? " funnel-top-open" : ""}`}
      ></span>
      <span
        className={`funnel-middle${showMenu ? " funnel-middle-open" : ""}`}
      ></span>
      <span
        className={`funnel-bottom${showMenu ? " funnel-bottom-open" : ""}`}
      ></span>
    </label>
  );
};

export default FunnelButton;
