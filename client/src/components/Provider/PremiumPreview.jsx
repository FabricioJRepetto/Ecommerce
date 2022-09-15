import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Carousel from '../Home/Carousel/Carousel'

import './PremiumPreview.css'

const PremiumPreview = () => {
  const { carouselIndex } = useSelector(state => state.extraSlice);
  const navigate = useNavigate();

    const images = [
    {
      // PLAYDATE
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1663096330/playdate_inagg3.jpg",
      url: "/premium/6307db1bc3e290e3e57b3015",
    },
    {
      // NAVE
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1663096330/nave_vkgiej.jpg",
      url: "/premium/62df1257d0bcaed708e4feb7",
    },
    {
      // Mira Pro
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1663096330/mirapro_jnj47z.jpg",
      url: "/premium/630805253f8827294d4b17b4",
    },
    {
      // Polaroid go
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1663096330/polaroid_p5m49k.jpg",
      url: "/premium/6316471837c51526ec170292",
    },
    {
      // Indy Evo
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1663096330/indyevo_yexuix.jpg",
      url: "/premium/6315627e9e03a149c6afd8f8",
    },
    {
      // KARA
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1663096330/kara_hc65fn.jpg",
      url: "/premium/6307fe2f59e9db1b1858060a",
    }
  ];
  const premiumDesc = [
    "Una nueva y pequeña consola de mano llena de nuevos juegos originales.",
    "NAVE es un juego difícil, hecho para jugar de pie, en un arcade.",
    "Mejora tu productividad y tu comodidad con Mira, un monitor de tinta electrónica.",
    "Esta cámara es tu nueva compañera en la creatividad y te acompañará a cualquier parte.",
    "Libérate con la conexión inalámbrica y batería extendida de los Indy Evo",
    "Infunde una estética retro-moderna y dale una personalidad única a tu setup.",
  ]

    const [change, setChange] = useState(false)
    useEffect(() => {
      setChange(!change)
      // eslint-disable-next-line
    }, [carouselIndex])

  return (
    <div className="store-premium">
          <div className='premiumPreview-carousel-container'>
                <Carousel
                    images={images}
                    pausable
                    pointer
                    indicators
                    shareIndex
                    id='premiumPreview'
                    width='100%'
                />
          </div>
          
          <div className="store-premium-text">
            <div>
              <div></div>
              <p className={ change ? 'spt-text' : 'spt-textb'}>{premiumDesc[carouselIndex]}</p>
            </div>
            <button
              className="g-white-button"
              onClick={() => navigate("/premium")}
            >
              Explorar Premium
            </button>
          </div>
    </div>
  )
}

export default PremiumPreview