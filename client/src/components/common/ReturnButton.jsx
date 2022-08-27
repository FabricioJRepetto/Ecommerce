import { NavLink } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import "./ReturnButton.css";

const ReturnButton = ({ to }) => {
  return (
    <span className="return-button-container">
      <NavLink to={to}>
        <span className="return-button">
          <ArrowBackIcon />
          {"   regresar"}
        </span>
      </NavLink>
    </span>
  );
};

export default ReturnButton;
