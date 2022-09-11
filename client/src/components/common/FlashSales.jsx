import axios from 'axios'
import { ReactComponent as Bolt } from '../../assets/svg/bolt.svg'
import React, { useEffect, useState } from 'react'
import MiniCard from '../Products/MiniCard'

import './FlashSales.css'
import { useSelector } from 'react-redux'

const FlashSales = () => {
    const [loading, setLoading] = useState(true)
    const [countdown, setCountdown] = useState('')
    const [products, setProducts] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [scrollY, setScrollY] = useState(0)
    const {wishlist} = useSelector(state => state.cartReducer)

    const handleWindowWidth = () => {
        setWindowWidth(window.innerWidth);
    }
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidth);

        let countdownInterv = null;
        countdownInterv = setInterval(() => {
            let now = new Date(),
             h = 23 - now.getHours(),
             m = 59 - now.getMinutes(),
             s = 59 - now.getSeconds();
            setCountdown(
                `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
                s < 10 ? "0" + s : s
                }`
            );
        }, 100);

        (async () => {
            const { data } = await axios("/sales");
            if (data) {
                setProducts(data);
                setLoading(false);
            }
        })();
    
        return () => {
            window.removeEventListener("resize", handleWindowWidth);
            clearInterval(countdownInterv);
        }
    }, [])

    useEffect(() => {
        //: resetear posición y scrollY
        // windowWidth <= 1350 && 
    }, [windowWidth])    
    
    const handleScrollY = (right) => {
        let slider = document.getElementById('flashSlider')

        //? tamaño total del slider: 322px * 5 = 1610px
        let visibleCards = 5 - Math.ceil(1610 / windowWidth)
        let sections = Math.ceil(5 / visibleCards)

        console.log(`cartas visibles: ${visibleCards}`);
        console.log(`secciones: ${sections}`);

        if (right && scrollY < sections) {
            console.log(`movimientos: ${scrollY+1}`);
                                                          //! Cuanto muevo???
            slider.style.transform = `translateX(-${(20 * visibleCards) * (scrollY+1)}%)`;
            setScrollY(scrollY + 1);            
        }
        if (!right && scrollY > 0) {
            console.log(`movimientos: ${scrollY-1}`);
                                                          //! Cuanto muevo???
            slider.style.transform = `translateX(${(20 * visibleCards) * (5 / scrollY)}%)`;
            setScrollY(scrollY - 1);
        }

        // slider.style.justifyContent = right ? 'flex-end' : 'flex-start'
     }

    return (
        <div className='flashsales-outter'>
            <div className='flashsales-container'>

            <div className='flashsales-header'>
                <div></div>
                <div></div>
                <div></div>
                <p>Flash Sales!</p>
                <Bolt className='bolt-svg'/>
                <p>{countdown}</p>
                <div></div>
                <div></div>
                <div></div>
            </div>

            {loading 
                ? <div>
                    <MiniCard loading={true}/>
                    <MiniCard loading={true}/>
                    <MiniCard loading={true}/>
                    <MiniCard loading={true}/>
                    <MiniCard loading={true}/>
                </div>
                : products 
                    ? <div className='flashsales-products-container'>
                        <div id='flashSlider' className='flashsales-products-inner'>
                            {React.Children.toArray(products.map(e => 
                                <MiniCard 
                                    img={e?.thumbnail}
                                    name={e?.name}
                                    price={e?.price}
                                    premium={e?.premium}
                                    sale_price={e?.sale_price}
                                    discount={e?.discount}
                                    prodId={e?._id}
                                    free_shipping={e?.free_shipping}
                                    on_sale={e?.on_sale}
                                    fav={wishlist.includes(e?._id)}
                                    loading={loading}/>                        
                            ))}
                        </div>

                        <button className='flashsales-buton-left' onClick={()=>handleScrollY()}>{'<='}</button>
                        <button className='flashsales-buton-right' onClick={()=>handleScrollY(true)}>{'=>'}</button>
                    </div>
                  : <h1>Parece que estás en el momento y lugar equivocados... 👀</h1>                    
                }

            </div>
        </div>
    )
}

export default FlashSales