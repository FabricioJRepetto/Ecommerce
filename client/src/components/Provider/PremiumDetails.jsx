import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useNotification } from '../../hooks/useNotification';
import { useCheckout } from '../../hooks/useCheckout';
import { priceFormat } from '../../helpers/priceFormat';
import { resizer } from '../../helpers/resizer';
import LoaderBars from '../common/LoaderBars';
import Carousel from '../Home/Carousel/Carousel';
import Footer from '../common/Footer';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { WishlistButton } from '../Products/WishlistButton';

import './PremiumDetails.css'

const PremiumDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(false);
    const [images, setImages] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification] = useNotification();
    const { addToCart, buyNow } = useCheckout();
    const { wishlist } = useSelector((state) => state.cartReducer);


    const reference = useRef(null)
    const [isVisible, setIsVisible] = useState(true)

    const attributesSection = useRef(null)
    const scrollTo = () => { 
        if (attributesSection.current) {
            attributesSection.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        }
     }     

    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
            const [ entry ] = entries
            setIsVisible(entry.isIntersecting)
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        });
        if (reference.current) observer.observe(reference.current)
    
      return () => {
        // eslint-disable-next-line
        if (reference.current) observer.unobserve(reference.current)
      }
    }, [reference, loading])
    

    useEffect(() => {
      (async () => {
        const { data } = await axios(`/product/${id}`);
        if (data) {
            setProduct(data);

            let aux = data.images.map(e => ({
                img: e.imgURL,
                url: ''
            }));
            setImages(aux);

            setLoading(false)
        } else notification('Producto no encontrado.', '', 'error');        
      })();
      // eslint-disable-next-line
    }, [])    

    return (
        <div className='premiumdetails-container'>
            {loading
                ? <div>
                    <LoaderBars />
                  </div>
                : <div className='premiumdetails-content'>
                    <div className='premiumdetails-head'>

                        <div className='provider-premium-sign'></div>
                        
                        <div className='premiumdetails-details'
                            style={{color: product.premiumData.textColor ? product.premiumData.textColor : 'white'}}>
                                
                            <span className='pd-favButton-container'>
                                <WishlistButton prodId={product.id} visible fav={wishlist.includes(product.id)} position={false}/>
                            </span>

                            {product.premiumData.logo 
                                ? <div className='premiumdetails-logo'>
                                    <img src={product.premiumData.logo} alt="" />
                                  </div>
                                : <h1 className='premiumdetails-name' >{product.name}</h1> }
                            
                            <h2>{product.premiumData.miniDescription}</h2>
                            <div className='premiumdetails-price'>
                                <span>${priceFormat(product.price).int}</span>
                                <span>{priceFormat(product.price).cents}</span>
                                {product.free_shipping && <p className='provider-text'> Envío gratis!</p>}                                
                            </div>
                            
                            <div ref={reference} 
                                className='premiumdetails-buttons'>                                    
                                {product.available_quantity < 1 && <p className='premiumdetails-nostock'>Fuera de stock</p>}
                                <button
                                    className="g-white-button details-button"
                                    disabled={product.available_quantity < 1}
                                    onClick={() => addToCart(id)}
                                >
                                    Agregar al carrito
                                </button>
                                <button
                                    className="g-white-button details-button"
                                    disabled={product.available_quantity < 1}
                                    onClick={() => buyNow(id)}
                                >
                                    Comprar ahora
                                </button>
                            </div>

                            {product.main_features && (
                                <div className="premiumdetails-mainfeatures">           
                                    <ul>
                                        {product.main_features.map((e) => (
                                        <li key={e}>· {e}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className='premiumdetails-toAttributesButton' 
                                onClick={scrollTo}>
                                    Ver especificaciones
                                    <ArrowDownIcon/>
                            </div>
                        </div>

                        <div className='premiumdetails-images'>
                            {images && <Carousel images={images} 
                                indicators
                                height={'80vh'}
                                width={'80vh'}
                            />}
                        </div>
                        
                        <div className='premiumdetails-background' 
                            style={{backgroundColor: product.premiumData.color}}></div>
                    </div>

                    {product.id === '62df1257d0bcaed708e4feb7' && 
                    <div className='pd-video-container'>
                        <div>
                            <video autoPlay muted controls loop controlsList="nodownload">
                                <source src="https://res.cloudinary.com/dsyjj0sch/video/upload/v1662173482/NAVE_Arcade_mp4.mp4" type="video/mp4"></source>
                            </video>
                        </div>
                    </div>}

                    {React.Children.toArray(product.premiumData.extraText.map(e => (
                        <div className='premiumdetails-section'
                            style={{ backgroundColor: e.bgColor }} >
                            <div style={{...e.textPos, color: product.premiumData.textColor ? product.premiumData.textColor : 'white'}}>
                                <h2>{e.title}</h2>
                                <p>{e.text}</p>
                            </div>

                            {e.img && <img src={e.img} alt="content img"
                                style={e.imgPos}/>}
                        </div>
                        ))
                    )}
                    
                    <div ref={attributesSection} className="tab-container">
                        <div className="tab-button-container">                           
                            <button className='tab-button tab-button-active'>
                                Atributos
                            </button>
                        </div>
                        <div className='premiumdetails-attributes'>
                            {React.Children.toArray(
                                product.attributes?.map(
                                (e) =>
                                    e.value_name && (
                                    <div className="pd-attribute-container">
                                        <div>{e.name}</div>
                                        <div>{e.value_name}</div>
                                    </div>
                                    )
                                )
                            )}
                        </div>                            
                    </div>

                    <div className='pd-logo-footer'>
                        {product.id === '62df1257d0bcaed708e4feb7'
                            ? <video src="https://res.cloudinary.com/dsyjj0sch/video/upload/v1662187563/2F5TPqZn_03sjNI4_nb7shw.mp4" muted autoPlay width={300} loop style={{filter: 'grayscale(1) contrast(1.2)'}}></video>
                            : <div  style={{ WebkitMaskImage: `url('${resizer(product.premiumData.logo, 310)}')`,
                                maskImage: `url('${resizer(product.premiumData.logo, 310)}')`}}>
                            </div>}
                    </div>

                    <div className={`premiumdetails-fixed ${isVisible ? '' : 'premiumdetails-fixed-on'}`}>
                        <div className='premiumdetails-fixed-content'>
                            <p>{product.name}</p>
                            <span>
                                <span>${priceFormat(product.price).int}</span>
                                <span>{priceFormat(product.price).cents}</span>   
                            </span>
                            <button
                                className="g-white-button details-button"
                                disabled={product.available_quantity < 1}
                                onClick={() => addToCart(id)}
                            >
                                Agregar al carrito
                            </button>
                            <button
                                className="g-white-button details-button"
                                disabled={product.available_quantity < 1}
                                onClick={() => buyNow(id)}
                            >
                                Comprar ahora
                            </button>
                        </div>
                    </div>

                    <Footer />
                  </div>
            }
        </div>
    )
}

export default PremiumDetails