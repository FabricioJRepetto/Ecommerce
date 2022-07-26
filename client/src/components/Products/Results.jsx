import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { 
    loadFilters, 
    loadProductsFound, 
    loadProductsOwn, 
    loadQuerys, 
    loadApplied,
    loadBreadCrumbs
 } from '../../Redux/reducer/productsSlice';
import Card from './Card';
import {ReactComponent as Spinner } from '../../assets/svg/spinner.svg';
import {ReactComponent as Arrow } from '../../assets/svg/arrow-right.svg';

import './Results.css';
import { useState } from 'react';

const Results = () => {
    const {wishlist} = useSelector((state) => state.cartReducer);    
    const querys = useSelector((state) => state.productsReducer.searchQuerys);
    const {productsOwn} = useSelector((state) => state.productsReducer);
    const {productsFound} = useSelector((state) => state.productsReducer);
    const applied = useSelector((state) => state.productsReducer.productsAppliedFilters);
    const {productsFilters} = useSelector((state) => state.productsReducer);
    const {breadCrumbs} = useSelector((state) => state.productsReducer);
    
    const [open, setOpen] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            let newQuery = "";
            Object.entries(querys).forEach(([key, value]) => {
                newQuery += key + "=" + value + "&";
            });

            const { data } = await axios(`/product/search/?${newQuery}`)
            // const { data } = await axios(`/product/promos`)
            
            dispatch(loadProductsOwn(data.db));
            dispatch(loadProductsFound(data.meli));
            dispatch(loadFilters(data.filters));
            dispatch(loadApplied(data.applied));
            dispatch(loadBreadCrumbs(data.breadCrumbs));
        })();

        // eslint-disable-next-line
    }, [querys]);

    const addFilter = async (obj) => {
        let filter = obj.filter;
        let value = obj.value;
        dispatch(loadQuerys({...querys, [filter]: value}));
    }

    const removeFilter = async (filter) => {
        let aux = { ...querys };
        delete aux[filter];
        dispatch(loadQuerys(aux));
    };

    return (
        <div className='results-container'>

            <div className='bread-crumbs'>
                {breadCrumbs?.length > 0 &&
                    React.Children.toArray(
                        breadCrumbs.map((c, index) => (
                            <span key={c.id} onClick={ () => addFilter({filter: 'category', value: c.id})}>{ (index > 0 ? ' > ' : '') + c.name }</span>
                        ))
                    )
                }
            </div>

            <div className='results-container-inner'>

                <div className="results-filters">
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
                </div>

                <div className='results-inner'>
                    {(productsFound !== 'loading' && (productsFound?.length > 0 || productsOwn?.length > 0))
                    ? <div>
                        {productsOwn?.length > 0 && <div className='own-products-container'>
                            {React.Children.toArray(
                                productsOwn?.map(prod => (
                                    prod.available_quantity > 0 && <Card
                                        productData={prod}
                                        fav={wishlist.includes(prod._id)}
                                    />
                                ))
                            )}
                        </div>}
                        {React.Children.toArray(
                            productsFound?.map(prod => (
                                prod.available_quantity > 0 && <Card
                                    productData={prod}
                                    fav={wishlist.includes(prod._id)}
                                />
                            ))
                        )}
                    </div>

                    : <div>
                        {productsFound === 'loading' ? <Spinner className='cho-svg'/> : <h1>No results</h1>}
                    </div>}
                </div>

            </div>

        </div>
    );
};

export default Results;
