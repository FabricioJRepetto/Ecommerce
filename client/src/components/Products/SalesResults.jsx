import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MiniCard from './MiniCard';
import './SalesResults.css'
import LoaderBars from '../common/LoaderBars';

const SalesResults = () => {
    const [products, setProducts] = useState();
    const [productsFilters, setProductsFilters] = useState('loading');
    const [loading, setLoading] = useState(true);
    const {wishlist} = useSelector(state => state.cartReducer)

    useEffect(() => {
      (async () =>{
        const { data } = await axios(`/product/promos`);
        setProducts(data);
        setLoading(false);
      })();

    }, [])
    
  return (
    <>
        <h1 className='sales-results-title'>Ofertas</h1>
        <h1 className="profile-section-indicator">OFERTAS</h1>
        {loading
        ? <div className='sales-results'>
            <LoaderBars/>
          </div>
        : <div className='sales-results'>
            {products && React.Children.toArray(products.map(e => (
                <MiniCard
                    productData={e}
                    fav={wishlist.includes(e?._id)}
                    loading={loading}/>
            )))}
            
        </div>}
    </>
    
  )
}

export default SalesResults