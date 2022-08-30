import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNotification } from '../../hooks/useNotification';
import { useCheckout } from '../../hooks/useCheckout';
import { priceFormat } from '../../helpers/priceFormat';
import LoaderBars from '../common/LoaderBars';
import Carousel from '../Home/Carousel/Carousel';
import Footer from '../common/Footer'

import './PremiumDetails.css'

const PremiumDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(false);
    const [images, setImages] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification] = useNotification();
    const { addToCart, buyNow } = useCheckout();


    useEffect(() => {
      (async () => {
        const { data } = await axios(`/product/${id}`);
        if (data) {
            setProduct(data);
            console.log(data);

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

                        <div className='premiumdetails-details'>
                            <p className='provider-text'>{`[PREMIUM LOGO PLACEHOLDER]`}</p>
                            {product.premiumData.logo 
                                ? <div className='premiumdetails-logo-container'>
                                    <img src={product.premiumData.logo} alt="" />
                                  </div>
                                : <h1>{product.name}</h1> }
                            
                            <h2>{product.premiumData.miniDescription}</h2>
                            <div className='premiumdetails-price'>
                                <span>${priceFormat(product.price).int}</span>
                                <span>{priceFormat(product.price).cents}</span>
                                {product.free_shipping && <p className='provider-text'> Envío flash gratis!</p>}                                
                            </div>
                            
                            <div className='premiumdetails-buttons'>
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
                                <div className="details-mainfeatures">
                                    <b>Caracteristicas principales</b>
                                    <div>
                                    <ul>
                                        {product.main_features.map((e) => (
                                        <li key={e}>{e}</li>
                                        ))}
                                    </ul>
                                    </div>
                                </div>
                            )}
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

                    {React.Children.toArray(product.premiumData.extraText.map(e => (
                        <div className='premiumdetails-section'
                            style={{ backgroundColor: e.bgColor }} >
                            <div style={e.textPos}>
                                <h2>{e.title}</h2>
                                <p>{e.text}</p>
                            </div>

                            <img src={e.img} alt="content img"
                                style={e.imgPos}/>
                        </div>
                        ))
                    )}

                  <Footer />

                  </div>
            }
        </div>
    )
}

export default PremiumDetails