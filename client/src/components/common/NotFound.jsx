import "./NotFound.css";
import { useLocation, Link } from "react-router-dom";
import { ReactComponent as ArrowBack } from "../../assets/svg/arrow-back.svg";

const NotFound = () => {
  const location = useLocation();
  const hasPreviousState = location.key !== "default";

  return (
    <div className="not-found-container component-fadeIn">
      <h1>Sitio no encontrado</h1>
      <Link to={hasPreviousState ? -1 : "/"}>
        <ArrowBack />
        <h2>regresar</h2>
      </Link>
    </div>
  );
};

export default NotFound;
