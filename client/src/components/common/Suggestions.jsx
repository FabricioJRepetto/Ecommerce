import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import MiniCard from '../Products/MiniCard'

import './Suggestions.css'

const Suggestions = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState(false)
    //const {wishlist} = useSelector(state => state.cartReducer)
    const {session, id} = useSelector(state => state.sessionReducer)
    
    useEffect(() => {
        (async () => {        
            const {data} = await axios.post(`/history/suggestion`, {userId: session ? id : false });
            if (data.length > 4 ) setProducts(data);
            else setProducts(false);

            setLoading(false);
        })()
        // eslint-disable-next-line
    }, []);

  return (
    <div className='suggestions-outter'>
            <div className='suggestions-container'>

            <div className='suggestions-header'>
                <p>Quizás te interese...</p>
                <div className='siggestion-eye'></div>
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
                                    // fav={wishlist.includes(e?._id)}
                                    fav={false}
                                    loading={false}/>
                            ))}
                        </div>
                    </div>
                  : <div className='suggestions-products-error'>
                        <h2>Parece que estás en el momento y lugar equivocado... 👀</h2>
                    </div>                    
                }

            </div>
        </div>
  )
}

export default Suggestions