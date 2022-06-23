import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { random } from '../../helpers/random';
import MiniCard from '../Products/MiniCard';
import Slider from './Carousel/Slider';
import "./Home.css";

const Home = () => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);

    const images = [
        'https://http2.mlstatic.com/D_NQ_674809-MLA50293741186_062022-OO.webp',
        'https://http2.mlstatic.com/D_NQ_977617-MLA50409269868_062022-OO.webp',
        'https://http2.mlstatic.com/D_NQ_745108-MLA50330042982_062022-OO.webp',
        'https://http2.mlstatic.com/D_NQ_751727-MLA50292961776_062022-OO.webp'
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
                <p>Banner Ofertas</p>
                <Slider images={images} controls indicators width='100%'/>
            </div>
            <div>
                <p>Categorias</p>
                <button>😀</button>
                <button>😋</button>
                <button>😎</button>
                <button>🤩</button>
                <button>🥰</button>
                <button>🤑</button>
            </div>
            <p>productos random</p>
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
                                fav={false}/>
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