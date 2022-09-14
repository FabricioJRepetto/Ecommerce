import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import MiniCard from '../Products/MiniCard'

import './Suggestions.css'

const Suggestions = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState(false)
    const {session} = useSelector((state) => state.sessionReducer)
    const {wishlist} = useSelector(state => state.cartReducer)
    
    useEffect(() => {
        session 
            ? (async () => {
                const suggestionData = axios(`/history/suggestion`) 

                suggestionData?.then(r => {
                    if (r.data.length > 4 ) {
                        setProducts(r.data);
                        console.log(r);
                    } else {
                        setProducts(false);                
                    }            
                });
                setLoading(false);
            })() 
            : setLoading(false);

        // eslint-disable-next-line
    }, []);

  return (
    <div className='suggestions-outter'>
            <div className='suggestions-container'>

            <div className='suggestions-header'>
                <div></div>
                <p>Quizás te interese... 👀</p>
                <div></div>
            </div>

            {loading
                ? <div className='suggestions-products-inner'>
                    <MiniCard loading={true}/>
                    <MiniCard loading={true}/>
                    <MiniCard loading={true}/>
                    <MiniCard loading={true}/>
                    <MiniCard loading={true}/>
                </div>
                : products 
                    ? <div className='suggestions-products-container'>
                        <div className='suggestions-products-inner'>
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

export default Suggestions