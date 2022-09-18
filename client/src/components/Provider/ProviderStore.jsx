import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";

import "./ProviderStore.css";
import FlashSales from "../common/FlashSales";
import PremiumPreview from "./PremiumPreview";
import CategoryCard from "./CategoryCard";

const ProviderStore = () => {
  const navigate = useNavigate();

  return (
    <div className="providerstore-container">

      <div className="providerstore-header-desktop">
            <div className="providerstore-echo-inner">
                <span>PROVIDER</span>
                <br />
                PROVIDER <br />
                PROVIDER
            </div>
            
            <div className="pro-sticky">
                <div className='providerstore-title'>
                    <div>
                        <span className="provider-store-title">STORE</span>                        
                    </div>
                </div>
            </div>
        </div>
        

        <div className="providerstore-header-mobile">
            <div className="pro-sticky">
                <div className='providerstore-title-mobile'>
                    <div>
                        <span>PROVIDER</span>                
                        <span className={`providerstore-title-text-mobile`}>
                            /DELUXE
                            <br />
                            /UNICOS
                            <br />
                            /TUYOS
                        </span>
                        
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
            <source src={'https://res.cloudinary.com/dsyjj0sch/video/upload/v1663453572/videos/production_ID_4990245_gcrvm2.mp4'} type="video/mp4"/>
        </video>
      </div>


      <div className="storecards-container">
        
        {/* <div className="providerstore-disclaimer">
            <h1>¿Qué es Provider Store?</h1>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt laboriosam repellat voluptate in, voluptatibus totam odio, natus ipsam velit nesciunt aperiam, beatae magni vitae reiciendis voluptatem repudiandae. Quas, temporibus blanditiis
        </div> */}

        <div className="storecards-inner">
            <CategoryCard text='COMPUTACIÓN'
                image='https://res.cloudinary.com/dsyjj0sch/image/upload/v1663464359/computacion_hds8ap.png' route='MLA1648'/>
            <CategoryCard text='VIDEOJUEGOS'
                image='https://res.cloudinary.com/dsyjj0sch/image/upload/v1663464359/videojuegos2_xfgxbc.png' route='MLA1144'/>
            <CategoryCard text='AUDIO'
                image='https://res.cloudinary.com/dsyjj0sch/image/upload/v1663464359/audio_bienyi.png' route='MLA409810'/>
            <CategoryCard text='CÁMARAS'
                image='https://res.cloudinary.com/dsyjj0sch/image/upload/v1663464359/camara_qhu2y4.png' route='MLA1039'/>
        </div>

        <div className="providerstore-category-buttons">
            <button className="g-white-button" onClick={() => navigate("/products")}>TODOS</button>

            <button className="g-white-button" onClick={() => navigate("/sales")}>OFERTAS</button>
        </div>               

        <FlashSales/>

        <div className="providerstore-premiumbrand">
            <div>
                <h2>provider</h2>
                <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663041222/premium-02_ymsk9h.png" alt="" />
                <p>Pasamos cientos de horas diseñando, probando y perfeccionando cada producto Premium en nuestra sede de Atalaya City. Pero nuestros ingenieros no son los típicos técnicos corporativos que usan batas de laboratorio. Son personas con las mejores ideas para mejorar sus propios hobbies. Viven para la aventura. Y saben lo que es trabajar sobre la marcha. Probablemente muy parecido a ti.</p>
            </div>
        </div>

        <PremiumPreview />

      </div>

      <Footer />
    </div>
  );
};

export default ProviderStore;
