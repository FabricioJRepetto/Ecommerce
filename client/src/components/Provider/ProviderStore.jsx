import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { resizer } from '../../helpers/resizer'
import { loadQuerys } from '../../Redux/reducer/productsSlice'
import Footer from '../common/Footer'
import Carousel from '../Home/Carousel/Carousel'
import MiniCard from '../Products/MiniCard'
import './ProviderStore.css'

const ProviderStore = () => {
    const images = [
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/9750_16688_wz1frg.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/8322_15233_xanjft.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661290053/9679_16615_q7wl6f.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/8552_15488_r0hefx.jpg',
            url: ''
        },
    ];    

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [countdown, setCountdown] = useState('');
    const [products, setProducts] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hover, setHover] = useState('');

    const {wishlist} = useSelector((state) => state.cartReducer);

    useEffect(() => {
        let countdownInterv = null;
        countdownInterv = setInterval(() => {
        let now = new Date();
        let h = 23 - now.getHours();
        let m = 59 - now.getMinutes();
        let s = 59 - now.getSeconds();
        setCountdown(
            `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
            s < 10 ? "0" + s : s
            }`
        );
        }, 100);

        (async () => {
            const { data } = await axios('/sales');
            setProducts(data)
            setLoading(false);
        })();

        return () => clearInterval(countdownInterv);
        // eslint-disable-next-line
    }, []);

    const goProducts = (code) => { 
        dispatch(loadQuerys({category: code}))
        navigate(`/results/?category=${code}`)
     }

    return (
        <div className='providerstore-container'>
            
            <div className='providerstore-echo-inner'>
                <span>PROVIDER</span><br/>
                PROVIDER <br/>
                PROVIDER 
            </div>
            <p className='providerstore-title'>STORE</p>
            <p className='providerstore-title-text'>/ORIGINALES<br/>/EXCLUSIVOS<br/>/TUYOS</p>
            <button className='providerstore-title-button g-white-button'
                onClick={()=> navigate('/products')}>Ver todos los productos</button>

            <div className='providerstore-header'></div>

            <div className='providerstore-background'></div>

            <div className='storecards-container'>
                
                <div className='storecards-inner'>

                    <div className="storecard"
                    onClick={()=> goProducts(`MLA1144`)}
                        onMouseEnter={()=> setHover('console')}
                        onMouseLeave={()=> setHover('')}>
                        <p>Consolas</p>
                        <p className={`storecard-subtitle ${hover === 'console' && 'subtitle-visible1'}`}>Consolas</p>
                        <p className={`storecard-subtitle ${hover === 'console' && 'subtitle-visible2'}`}>Consolas</p>
                        <img src={resizer('https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328214/Playdate-photo_hxdnpj.png', 200)} alt="img" />
                    </div>
                    <div className="storecard"
                    onClick={()=> goProducts(`MLA454379`)}
                        onMouseEnter={()=> setHover('periph')}
                        onMouseLeave={()=> setHover('')}>
                        <p>Perifericos</p>
                        <p className={`storecard-subtitle ${hover === 'periph' && 'subtitle-visible1'}`}>Perifericos</p>
                        <p className={`storecard-subtitle ${hover === 'periph' && 'subtitle-visible2'}`}>Perifericos</p>
                        <img src={resizer('https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328896/RW-ZENITH-01.2020_1400x_j4iupn.webp', 200)} alt="img" />
                    </div>
                    <div className="storecard"
                    onClick={()=> goProducts(`MLA409810`)}
                        onMouseEnter={()=> setHover('audio')}
                        onMouseLeave={()=> setHover('')}>
                        <p>Audio</p>
                        <p className={`storecard-subtitle ${hover === 'audio' && 'subtitle-visible1'}`}>Audio</p>
                        <p className={`storecard-subtitle ${hover === 'audio' && 'subtitle-visible2'}`}>Audio</p>
                        <img src='https://www.tradeinn.com/f/13756/137567598/skullcandy-auriculares-inalambricos-crusher.jpg' alt="img" />
                    </div>
                    <div className="storecard"
                    onClick={()=> goProducts(`MLA409810`)}
                        onMouseEnter={()=> setHover('display')}
                        onMouseLeave={()=> setHover('')}>
                        <p>Monitores</p>
                        <p className={`storecard-subtitle ${hover === 'display' && 'subtitle-visible1'}`}>Monitores</p>
                        <p className={`storecard-subtitle ${hover === 'display' && 'subtitle-visible2'}`}>Monitores</p>
                        <img src='https://static.bhphoto.com/images/images500x500/1643045763_1683182.jpg' alt="img" />
                    </div>

                </div>

                <div className='providerstore-flashsales'>
                    <h2>Flash sales! ⏱ {countdown}</h2>
                    <div className="providerstore-flashsales-container">
                        {Array.from(Array(5).keys()).map((_, index) => (
                            <MiniCard
                                key={`specials ${index}`}
                                img={products[index]?.thumbnail}
                                name={products[index]?.name}
                                price={products[index]?.price}
                                premium={products[index]?.premium}
                                sale_price={products[index]?.sale_price}
                                discount={products[index]?.discount}
                                prodId={products[index]?._id}
                                free_shipping={products[index]?.free_shipping}
                                on_sale={products[index]?.on_sale}
                                fav={wishlist.includes(products[index]?._id)}
                                loading={loading}/>
                        ))}
                    </div>
                </div>

                <div className='providerstore-premiumbrand'></div>

                <div className='store-premium'>                
                    <Carousel images={images}
                        pausable
                        pointer
                        indicators
                        width='40vw'
                        height='100%' />
                    <div className='store-premium-text'>
                        <div>
                            <h1>Provider Premium</h1>
                            <p>Una selección exclusiva de los mejores productos original Provider store.</p>
                        </div>
                        <button className='g-white-button'
                            onClick={()=> navigate('/premium')}>Ver los productos Premium</button>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
  )
}

export default ProviderStore