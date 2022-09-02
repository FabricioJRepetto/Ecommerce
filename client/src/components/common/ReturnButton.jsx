import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowBack } from "../../assets/svg/arrow-back.svg";
import "./ReturnButton.css";

const ReturnButton = ({ to }) => {
  return (
    <span className="return-button-container">
      <NavLink to={to}>
        <span className="return-button">
          <ArrowBack />
          <div className="arrow-back-gradient"></div>
          <span>regresar</span>
        </span>
      </NavLink>
    </span>
  );
};

export default ReturnButton;
