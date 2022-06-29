import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import MiniCard from '../Products/MiniCard';
import Carousel from './Carousel/Carousel';
import Footer from '../common/Footer';
import "./Home.css";

import { ReactComponent as One } from "../../assets/svg/bloom-svgrepo-com.svg";
import { ReactComponent as Two } from "../../assets/svg/build-svgrepo-com.svg";
import { ReactComponent as Three } from "../../assets/svg/code-svgrepo-com.svg";
import { ReactComponent as Four } from "../../assets/svg/crop-svgrepo-com.svg";
import { ReactComponent as Five } from "../../assets/svg/explode-svgrepo-com.svg";
import { ReactComponent as Six } from "../../assets/svg/perform-svgrepo-com.svg";

const Home = () => {
    const [products, setProducts] = useState(false);
    const [countdown, setCountdown] = useState('')
    const [loading, setLoading] = useState(true);
    const whishlist = useSelector((state) => state.cartReducer.whishlist);

    const images = [
        {img:'https://http2.mlstatic.com/D_NQ_794413-MLA50423210111_062022-OO.webp',
         url: '/products'},
        {img:'https://http2.mlstatic.com/D_NQ_977617-MLA50409269868_062022-OO.webp',
         url: '/products'},
        {img:'https://http2.mlstatic.com/D_NQ_745108-MLA50330042982_062022-OO.webp',
         url: '/products'},
        {img:'https://http2.mlstatic.com/D_NQ_751727-MLA50292961776_062022-OO.webp',
         url: '/products'},
        {img:'https://http2.mlstatic.com/D_NQ_627971-MLA50423148467_062022-OO.webp',
         url: '/products'}
    ];
    
    useEffect(() => {
        let countdownInterv = null;
        countdownInterv = setInterval(() => {
            let now = new Date();
            let h = 23 - now.getHours();
            let m = 59 - now.getMinutes();
            let s = 59 - now.getSeconds();
            setCountdown(`${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`);
        }, 100);

        (async () => {
            const {data} = await axios(`/sales/`);
            setProducts(data);
            setLoading(false);
        })();
        
        return () => (
            clearInterval(countdownInterv)
        )
    }, []);

    return (
        <div className='home-container'>
            <div>
                <Carousel images={images} controls indicators pointer width='100%'/>
            </div>
            <div className='categories'>
                <div>
                    <One className={'svg'}/>
                    <p>Smartphones</p>
                </div>
                <div>
                    <Two className={'svg'}/>
                    <p>Computers</p>
                </div>
                <div>
                    <Three className={'svg'}/>
                    <p>Cameras</p>
                </div>
                <div>
                    <Four className={'svg'}/>
                    <p>Audio & Video</p>
                </div>
                <div>
                    <Five className={'svg'}/>
                    <p>Videogames</p>
                </div>
                <div>
                    <Six className={'svg'}/>
                    <p>TVs</p>
                </div>
            </div>
            <div >
                <h2>Flash sales! ⏱ {countdown}</h2>
                <div className='random-container'>
                    {Array.from(Array(5).keys()).map((_, index) =>(
                        <MiniCard
                            key={`specials ${index}`}
                            loading={loading}
                            img={products[index]?.images[0]?.imgURL} 
                            name={products[index]?.name} 
                            price={products[index]?.price}
                            sale_price={products[index]?.sale_price}
                            discount={products[index]?.discount}
                            prodId={products[index]?._id} 
                            free_shipping={products[index]?.free_shipping}
                            on_sale={products[index]?.on_sale} 
                            fav={whishlist.includes(products[index]?._id)}
                        />
                    ))}
                </div>
            </div>
            <br/>
            <Footer />
        </div>
    )
};

export default Home;

/*
<MiniCard 
    img={products[0]?.images[0]?.imgURL || false} 
    name={products[0]?.name || false} 
    price={products[0]?.price || false} 
    prodId={products[0]?._id || false} 
    free_shipping={products[0]?.free_shipping || false}
    on_sale={products[0]?.on_sale || false} 
    fav={whishlist.includes(products[0]?._id) || false}/>
 */