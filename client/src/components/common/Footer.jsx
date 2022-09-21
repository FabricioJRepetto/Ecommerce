import { Link } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import "./Footer.css";

const Footer = () => {
  return (
    <span className="footer-container">
      {/* <img
        src={resizer(
          "https://res.cloudinary.com/dsyjj0sch/image/upload/v1659650791/PROVIDER_LOGO_glitch_aberration_kt2hyv.png",
          200
        )}
        alt="provider"
      /> */}

      <div className="footer-links-container">
        <div>
          <p className="footer-suscribe">Suscríbete</p>
          <input type="text" />
        </div>

        <ul>
          <li>
            <Link to="/about">Contacto</Link>
          </li>

          <li>
            <Link to="/about">¿Quiénes somos?</Link>
          </li>

          <li>
            <Link to="/about">Trabaja con nosotros</Link>
          </li>

          <li>
            <Link to="/">Términos y condiciones</Link>
          </li>

          <li>
            <Link to="/">Preguntas frecuentes</Link>
          </li>
        </ul>
      </div>

      <div className="footer-copyright-container">
        <p>© 2022 Provider S.R.L. Todos los derechos reservados</p>
      </div>
    </span>
  );
};

export default Footer;
