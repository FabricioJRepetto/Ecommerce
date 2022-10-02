import { Link } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import "./Footer.css";

const Footer = () => {
    const notification = useNotification();

    const newsletterHandler = (e) => { 
        e.code === 'Enter' && notification('mentira 🤣')
        // alert('¡Felicitaciones! Eres la primer persona que se suscribe a un newsletter. Por tu propio bien, no vamos a enviarte mails ¡jamás!')
     }

  return (
    <span className="footer-container">
        <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1659650791/PROVIDER_LOGO_glitch_aberration_kt2hyv.png" alt="footer logo" />
      <h1>PROVIDER STORE</h1>

      <div className="footer-links-container">
        <div onKeyDown={newsletterHandler}>
          <p className="footer-suscribe">Suscríbete</p>
          <input type="text"/>
        </div>

        <ul>
          <li>
            <Link to="/about">Contacto</Link>
          </li>

          <li>
            <Link to="/about">¿Quiénes somos?</Link>
          </li>

          <li>
            <Link to="/faqs">Preguntas frecuentes</Link>
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
