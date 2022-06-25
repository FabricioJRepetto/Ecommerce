import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { random } from '../../helpers/random';
import MiniCard from '../Products/MiniCard';
import Carousel from './Carousel/Carousel';
import "./Home.css";

import { ReactComponent as One } from "../../assets/svg/bloom-svgrepo-com.svg";
import { ReactComponent as Two } from "../../assets/svg/build-svgrepo-com.svg";
import { ReactComponent as Three } from "../../assets/svg/code-svgrepo-com.svg";
import { ReactComponent as Four } from "../../assets/svg/crop-svgrepo-com.svg";
import { ReactComponent as Five } from "../../assets/svg/explode-svgrepo-com.svg";
import { ReactComponent as Six } from "../../assets/svg/perform-svgrepo-com.svg";

const Home = () => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const whishlist = useSelector((state) => state.cartReducer.whishlist);

    const images = [
        {img:'https://http2.mlstatic.com/D_NQ_674809-MLA50293741186_062022-OO.webp',
         url: '/products'},
        {img:'https://http2.mlstatic.com/D_NQ_977617-MLA50409269868_062022-OO.webp',
         url: '/products'},
        {img:'https://http2.mlstatic.com/D_NQ_745108-MLA50330042982_062022-OO.webp',
         url: '/products'},
        {img:'https://http2.mlstatic.com/D_NQ_751727-MLA50292961776_062022-OO.webp',
         url: '/products'},
        {img:'https://http2.mlstatic.com/D_NQ_627971-MLA50423148467_062022-OO.webp',
         url: '/products'}
    ]
    
    useEffect(() => {
        (async () => {
            const {data} = await axios(`/product/`);
            let indexes = random(data.length, 5)
            let aux = data.filter((e, index) =>(
                indexes.includes(index)
            ));
            setProducts(aux);
            setLoading(false);
        })();
    }, []);

    return (
        <>
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
            <div>
                {loading
                    ? <h1>LOADING</h1>
                    : <div className='random-container'>
                        {React.Children.toArray(products?.map(p => (
                            <MiniCard 
                                img={p.images[0].imgURL} 
                                name={p.name} 
                                price={p.price} 
                                brand={p.brand} 
                                prodId={p._id} 
                                free_shipping={p.free_shipping}
                                fav={whishlist.includes(p._id)}/>
                        )))}
                    </div>
                }
            </div>
            <br/>
            <div>
                <hr/>
                <p>subscribe to our newsletter</p>
                <input type="text" />
                <br/>
                <p><u>Contact us</u></p>
                <p><u>About us</u></p>
                <p><u>Work with us</u></p>
                <p><u>FAQ's</u></p>
                <br/>
                <p>Provider™ · 2022 all rights reserved</p>
            </div>
        </>
    )
};

export default Home;