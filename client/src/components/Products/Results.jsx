import React from 'react'
import { useSelector } from 'react-redux'
import Card from './Card'
import {ReactComponent as Spinner } from '../../assets/svg/spinner.svg'

import './Results.css'

const Results = () => {
  const productsOwn = useSelector((state) => state.productsReducer.productsOwn);
  const productsFound = useSelector((state) => state.productsReducer.productsFound);
  const whishlist = useSelector((state) => state.cartReducer.whishlist);
    console.log(productsOwn);
    console.log(productsFound);

  return (
    <div className='results-container'>
        <div className="results-filters">filtros</div>
        <div className='results-inner'>
            <h2>Results</h2>

            {(productsFound !== 'loading' && (productsFound.length > 0 || productsFound.length > 0))
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