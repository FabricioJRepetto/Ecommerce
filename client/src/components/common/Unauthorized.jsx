import "./Unauthorized.css";
import { useLocation, Link } from "react-router-dom";
import { ReactComponent as ArrowBack } from "../../assets/svg/arrow-back.svg";

const Unauthorized = () => {
  const location = useLocation();
  const hasPreviousState = location.key !== "default";

  return (
    <div className="unauthorized-container component-fadeIn">
      <h1>Sin autorización</h1>
      <Link to={hasPreviousState ? -1 : "/"}>
        <ArrowBack />
        <h2>regresar</h2>
      </Link>
    </div>
  );
};

export default Unauthorized;
