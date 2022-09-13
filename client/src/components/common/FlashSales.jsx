import axios from 'axios'
import { ReactComponent as Bolt } from '../../assets/svg/bolt.svg'
import React, { useEffect, useState } from 'react'
import MiniCard from '../Products/MiniCard'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import CountDown from './CountDown'

import './FlashSales.css'

const FlashSales = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState(false)
    const {wishlist} = useSelector(state => state.cartReducer)
    
    useEffect(() => {
        (async () => {
            const { data } = await axios("/sales");
            if (data) {
                setProducts(data);
                setLoading(false);
            }
        })();
    }, [])

    return (
        <div className='flashsales-outter'>
            <div className='flashsales-container'>

            <div className='flashsales-header'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <p>Flash Sales!</p>
                <Bolt className='bolt-svg'/>
                <CountDown />
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            {loading
                ? <div className='flashsales-products-inner'>
                    <MiniCard productData={false} loading={true}/>
                    <MiniCard productData={false} loading={true}/>
                    <MiniCard productData={false} loading={true}/>
                    <MiniCard productData={false} loading={true}/>
                    <MiniCard productData={false} loading={true}/>
                </div>
                : products 
                    ? <div className='flashsales-products-container'>
                        <div className='flashsales-products-inner'>
                            {React.Children.toArray(products.map(e => 
                                <MiniCard
                                    productData={e}
                                    fav={wishlist.includes(e?._id)}
                                    loading={false}/>
                            ))}
                        </div>
                    </div>
                  : <h1>Parece que estás en el momento y lugar equivocados... 👀</h1>                    
                }

            </div>
        </div>
    )
}

export default FlashSales