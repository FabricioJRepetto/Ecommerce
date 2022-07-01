import React from 'react'
import { useSelector } from 'react-redux'
import Card from './Card'

import './Results.css'

const Results = () => {
  const productsFound = useSelector((state) => state.productsReducer.productsFound);
  const whishlist = useSelector((state) => state.cartReducer.whishlist);
    console.log(productsFound);

  return (
    <div className='results-container'>
        <div className="results-filters">filtros</div>
        <div className='results-inner'>
            <h2>Results</h2>
            {(productsFound && productsFound.length > 0)
            ? <div>{React.Children.toArray(
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
                )}</div>

            : <h3>no results</h3>}

        </div>
    </div>
  )
}

export default Results