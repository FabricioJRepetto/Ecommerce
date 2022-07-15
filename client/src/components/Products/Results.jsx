import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from './Card'
import {ReactComponent as Spinner } from '../../assets/svg/spinner.svg'

import './Results.css'
import { loadFilters, loadProductsFound, loadProductsOwn, loadQuerys } from '../../Redux/reducer/productsSlice'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const Results = () => {
    const whishlist = useSelector((state) => state.cartReducer.whishlist);
    const productsOwn = useSelector((state) => state.productsReducer.productsOwn);
    const productsFound = useSelector((state) => state.productsReducer.productsFound);
    const productsFilters = useSelector((state) => state.productsReducer.productsFilters);

    const querys = useSelector((state) => state.productsReducer.searchQuerys);
    const [applied, setApplied] = useState([]);

    const dispatch = useDispatch();    

    //console.log(productsOwn);
    //console.log(productsFound);
    //console.log(productsFilters);
    console.log(querys);

    const addFilter = async (obj) => {
        let nName = obj.name;
        let nFilter = obj.filter;
        let nValue = obj.value;

        if (nFilter !== 'category') {
            setApplied([...applied, { name: nName, filter: nFilter }])
        }

        //: remplazar categorias
        // como tarda en actualizar el estado, utilizo un objeto auxiliar
        let aux = {...querys, [nFilter]: nValue}
        dispatch(loadQuerys(aux));
        //: armar nueva query
        let newQuery = ''
        Object.entries(aux).forEach(([key, value]) => {
            newQuery += key + '=' + value + '&'
        })
        
        const { data } = await axios(`/product/search/?${newQuery}`);
        dispatch(loadProductsOwn(data.db));
        dispatch(loadProductsFound(data.meli));
        dispatch(loadFilters(data.filters));
     }

     const removeFilter = async (filter) => {
        
     }

  return (
    <div className='results-container'>
        <div className="results-filters">
            <h2>Filtros</h2>
            <div>
                <b>filtros aplicados</b>
                {applied.length > 0 && 
                    React.Children.toArray(applied.map(f => (
                        <div>{f.name}</div>
                    )))
                }
            </div>
            <hr />
            {(productsFilters !== 'loading' && productsFilters.length > 0) &&
                    React.Children.toArray(productsFilters?.map(f => (
                        <div key={f.id}>
                            <b>{f.name}</b>
                            {f.values.map(v => (
                                <div key={v.id} onClick={() => addFilter({name: v.name, filter: f.id, value: v.id })}>
                                    <p>{`${v.name} (${v.results})`}</p>
                                </div>
                            ))}
                        </div>
                    )))
            }
        </div>

        <div className='results-inner'>
            <h2>Results</h2>
            {(productsFound !== 'loading' && productsFound.length > 0)
            ? <div>
                <div className='own-products-container'>
                    {productsOwn.length > 0 && React.Children.toArray(
                    productsOwn?.map(prod => (
                        <Card
                            img={prod.thumbnail}
                            name={prod.name}
                            price={prod.price}
                            sale_price={prod.sale_price}
                            discount={prod.discount}
                            brand={prod.brand}
                            prodId={prod._id}
                            free_shipping={prod.free_shipping}
                            fav={whishlist.includes(prod._id)}
                            on_sale={prod.on_sale}
                        />
                    ))
                )}
                </div>
                <br />
                {React.Children.toArray(
                    productsFound?.map(prod => (
                        <Card
                            img={prod.thumbnail}
                            name={prod.name}
                            price={prod.price}
                            sale_price={prod.sale_price}
                            discount={prod.discount}
                            brand={prod.brand}
                            prodId={prod._id}
                            free_shipping={prod.free_shipping}
                            fav={whishlist.includes(prod._id)}
                            on_sale={prod.on_sale}
                        />
                    ))
                )}
            </div>

            : <div>
                {productsFound === 'loading' ? <Spinner className='cho-svg'/> : <h1>No results</h1>}
            </div>}

        </div>
    </div>
  )
}

export default Results