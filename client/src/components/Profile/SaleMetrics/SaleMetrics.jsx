import React, { useEffect, useState } from 'react'
import { priceFormat } from '../../../helpers/priceFormat';

import './SaleMetrics.css'

const SaleMetrics = ({props}) => {
    // const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //   // eslint-disable-next-line
    // }, [])

    console.log(props);

    let maxSale = 0;
    let totalRevenue = 0;
    props?.sales.forEach(s => {
        totalRevenue += s.price * s.quantity;
        maxSale < (s.price * s.quantity) && (maxSale = s.price * s.quantity);
    });

    const percenter = (num) => { 
        return Math.round((num * 100) / maxSale)
    }
    
    return (
        <>
            <h1>Publication name: {props.product.name}</h1>
            <h1>Publication price: {props.product.price}</h1>
            <img src={props.product.thumbnail} alt='product' height={100} width={100}></img>
            <h1>{'[botones] [botones] [botones]'}</h1>
            <h2>Total revenue: {priceFormat(totalRevenue).int}</h2>
            <h2>Current stock: {props.product.available_quantity}</h2>
            <h2>Total sells: {props.sales.length}</h2>
            <h2>Current rating: {props.product.average_calification}</h2>
            <br/>
            <h2>Last sales:</h2>

            <div className='sales-metrics-graph'>
                {props?.sales.map((s, index) => (
                    <div key={`${index} ${s.buyer._id}`} 
                        className='sales-metrics-graph-bar' 
                        style={{height: `${percenter(s.price * s.quantity)}%`}}>
                        <p>precio: {s.price}</p>
                        <p>unidades: {s.quantity}</p>
                        <p>{percenter(s.price * s.quantity)}%</p>
                        <p>{'/ / / / /'}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SaleMetrics