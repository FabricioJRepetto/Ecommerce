import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlashSales from "../common/FlashSales";
import PremiumPreview from "./PremiumPreview";
import CategoryCard from "./CategoryCard";
import { PowerGlitch } from "powerglitch";

import "./ProviderStore.css";

const ProviderStore = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const buttons = document.getElementsByName("ps-button-hover");
    console.log(buttons);
    buttons.forEach((b) =>
      PowerGlitch.glitch(b, {
        imageUrl:
          "https://res.cloudinary.com/dsyjj0sch/image/upload/v1663602148/glitch-03_cplipt.png",
        backgroundColor: "transparent",
        hideOverflow: false,
        timing: {
          duration: 3000,
          iterations: "Infinity",
        },
        glitchTimeSpan: {
          start: 0,
          end: 1,
        },
        shake: {
          velocity: 50,
          amplitudeX: 0.7,
          amplitudeY: 0.7,
        },
        slice: {
          count: 18,
          velocity: 15,
          minHeight: 0.03,
          maxHeight: 0.15,
          hueRotate: true,
        },
      })
    );
    // eslint-disable-next-line
  }, []);

  return (
    <div className="providerstore-container">
      <div className="providerstore-header-desktop">
        <div className="providerstore-echo-inner">
          <span>PROVIDER</span>
          <br />
          PROVIDER <br />
          PROVIDER <br />
          PROVIDER
        </div>

        <div className="providerstore-title">
          <span>STORE</span>
        </div>
      </div>

      <div className="providerstore-header-mobile">
        <div className="pro-sticky">
          <div className="providerstore-title-mobile">
            <div>
              <span>PROVIDER</span>
            </div>
          </div>
        </div>

        <div className="providerstore-echo-inner-mobile">
          <span>STORE</span>
          <br />
          STORE <br />
          STORE
        </div>
      </div>

      <div className="providerstore-header">
        <video id="ps-header-bg-video" autoPlay loop muted>
          <source
            src={
              "https://res.cloudinary.com/dsyjj0sch/video/upload/v1663453572/videos/production_ID_4990245_gcrvm2.mp4"
            }
            type="video/mp4"
          />
        </video>
      </div>

      <div className="storecards-container">
        {/* <div className="providerstore-disclaimer">
            <h1>¿Qué es Provider?</h1>
            <p>Encuentra los mejores productos de distintas tiendas especializadas en un solo lugar.</p>
            <p>Explora Provider Store para ver nuestros seleccionados.</p>
        </div> */}

        <div className="storecards-inner">
          <CategoryCard
            text="COMPUTACIÓN"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/computacion_iczryv.png"
            route="MLA1648"
          />
          <CategoryCard
            text="VIDEOJUEGOS"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/videojuegos2_hvufj4.png"
            route="MLA1144"
          />
          <CategoryCard
            text="AUDIO"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/audio_bbrp2m.png"
            route="MLA409810"
          />
          <CategoryCard
            text="CÁMARAS"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/camara_epkefy.png"
            route="MLA1039"
          />
        </div>

        <div className="providerstore-category-buttons">
          <div className="ps-button-container">
            <div name="ps-button-hover" id="ps-button01"></div>
            <button
              className="g-white-button"
              onClick={() => navigate("/products")}
            >
              TODOS LOS PRODUCTOS
            </button>
          </div>

          <div className="ps-button-container">
            <div name="ps-button-hover" id="ps-button02"></div>
            <button
              className="g-white-button"
              onClick={() => navigate("/sales")}
            >
              BUSCADOR DE OFERTAS
            </button>
          </div>
        </div>

        <FlashSales />

        <div className="providerstore-premiumbrand">
          <div>
            <h2>provider</h2>
            <img
              src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663041222/premium-02_ymsk9h.png"
              alt=""
            />
            <p>
              Pasamos cientos de horas diseñando, probando y perfeccionando cada
              producto Premium en nuestra sede de Atalaya City. Pero nuestros
              ingenieros no son los típicos técnicos corporativos que usan batas
              de laboratorio. Son personas con las mejores ideas para mejorar
              sus propios hobbies. Viven para la aventura. Y saben lo que es
              trabajar sobre la marcha. Probablemente muy parecido a ti.
            </p>
          </div>
        </div>

        <PremiumPreview />
      </div>
    </div>
  );
};

export default ProviderStore;
