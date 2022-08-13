import { resizer } from "../../helpers/resizer";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
        <img src={resizer("https://res.cloudinary.com/dsyjj0sch/image/upload/v1659650791/PROVIDER_LOGO_glitch_aberration_kt2hyv.png", 200)} alt="provider" />
        <p>subscribe to our newsletter</p>
        <input type="text" />
        <p><u>Contact us</u></p>
        <p><u>About us</u></p>
        <p><u>Work with us</u></p>
        <p><u>FAQ's</u></p>
        <p>Provider™ · 2022 all rights reserved</p>
    </div>
  );
};

export default Footer;
