import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MiniCard from './MiniCard';
import './SalesResults.css'

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
    <div>
        <h1>Sales!</h1>
        {/* <div className="results-filters">
            <div>
                {applied !== 'loading' && applied?.length > 0 && 
                    React.Children.toArray(applied.map(f => (
                        <div onClick={()=>removeFilter(f.id)}>{f.values[0].name}</div>
                    )))
                }
            </div>
            {(productsFilters !== 'loading' && productsFilters?.length > 0) &&
                    React.Children.toArray(productsFilters?.map(f => (
                        <div key={f.id} className={`results-filter-container ${open === f.id && 'open-filter'}`}>
                            <div onClick={() => setOpen(open === f.id ? '' : f.id)} className='filter-title'>
                                <b>{f.name}</b>
                                <Arrow className={`filters-arrow-svg ${open === f.id && 'open-arrow'}`}/>
                            </div>
                            {f.values.map(v => (
                                <div key={v.id} onClick={() => addFilter({filter: f.id, value: v.id })} className='results-filter-option'>
                                    <p>{`${v.name} (${v.results})`}</p>
                                </div>
                            ))}
                        </div>
                    )))
            }
        </div> */}

        <div className='sales-results'>
            {products && React.Children.toArray(products.map(e => (
                <MiniCard
                    productData={e}
                    fav={wishlist.includes(e?._id)}
                    loading={loading}/>
            )))}
            
        </div>
    </div>
    
  )
}

export default SalesResults