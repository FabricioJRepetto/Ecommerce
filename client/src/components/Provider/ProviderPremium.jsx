import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Footer from '../common/Footer'
import LoaderBars from '../common/LoaderBars'
import PremiumCard from './PremiumCard'
import "./ProviderPremium.css"

const ProviderPremium = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState(false)

    useEffect(() => {
      (async () => {
        const { data } = await axios('/product/premium')
        data && setProducts(data);
        console.log(data);

        setLoading(false);
      })();
    }, []);    

  return (
    <div>
        <div className='providerstore-echo-inner'>
            <span>PROVIDER</span><br/>
                PROVIDER <br/>
                PROVIDER 
        </div>
        <p className='providerstore-title'>PREMIUM</p>
        <p className='providerpremium-title-text'>/DELUXE<br/>/UNICOS<br/>/TUYOS</p>

        <div className='providerpremium-header'></div>
        
        <div className='providerpremium-background'></div>
        
        <div className='providerpremium-cardscontainer'>
            {loading || !products
            ? <LoaderBars/>
            : React.Children.toArray(products.map((e, index) =>
                <PremiumCard productData={e} direction={index%2 === 0 ? true : false}/>
            ))}
        </div>
        
        <Footer />
        {/* <div style={{display: 'block'}}>
        </div> */}
    </div>
  )
}

export default ProviderPremium