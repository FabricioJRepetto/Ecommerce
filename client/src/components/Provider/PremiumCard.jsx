import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toRGB } from "../../helpers/toRGB";
import "./PremiumCard.css";

const PremiumCard = ({ productData, direction }) => {
  const { id, name, images, premiumData } = productData;

  const [color, setColor] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    !color && setColor(toRGB(premiumData.color));
    // eslint-disable-next-line
  }, []);

  const textColor = premiumData.textColor || "#ffffff";
  const gradient = `linear-gradient(-135deg, ${premiumData.color} 0%, ${premiumData.color} 40%, rgba(${color}, 0.8) 100%)`;
  const background = `linear-gradient(45deg, ${textColor} 0%,${textColor + '80'} 30%,${textColor} 60%,${textColor} 100%)`;
  const textStyles = {background, 
        color: 'transparent', 
        WebkitBackgroundClip: 'text',
        backgroundPosition: '100%',
        backgroundSize: '300%'                
    };

  return (
    <div className={`premiumcard-container ${
        direction ? "premiumcard-direct-normal" : "premiumcard-direct-reverse"
      } component-fadeIn`}
      onClick={() => navigate(`/premium/${id}`)}
    >
      <div className='premiumcard-img-container'>
        <img src={images[0].imgURL} alt="card product" />
      </div>

      <div className="premiumcard-lateral-container"
        style={{
          background: gradient
        }}
      >
        <p className="premiumcard-name" 
            style={textStyles}>{name}</p>
        <p className="premiumcard-description"
            style={textStyles}>{premiumData.miniDescription}</p>
      </div>
    </div>
  );
};

export default PremiumCard;
