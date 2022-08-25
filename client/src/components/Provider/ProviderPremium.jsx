import React from 'react'
import { resizer } from '../../helpers/resizer'
import Footer from '../common/Footer'
import PremiumCard from './PremiumCard'
import "./ProviderPremium.css"

const ProviderPremium = () => {
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
        {/* <PremiumCard /> */}
        <div className='providerpremium-cardscontainer'>
            <div className="wrapper">
                <div className="one">One description</div>
                <div className="oneB">
                    <img src='https://res.cloudinary.com/dsyjj0sch/image/upload/v1661329067/3_6cd803a8-4aa4-48bd-95a7-b11d1f9fdeda_pzkil8.webp' alt="" style={{maxHeight: '100%', maxWidth: '100%'}}/>
                </div>

                <div className="two">
                    <img src='https://images.squarespace-cdn.com/content/v1/563c788ae4b099120ae219e2/1635390542312-KG7QBVP5WY1OJFOCW9F2/RW-M65-C.90.png?format=500w' alt="" style={{maxHeight: '100%', maxWidth: '100%'}}/>
                </div>
                <div className="twoB">Two description</div>

                <div className="three">Three description</div>
                <div className="threeB">
                    <img src='https://i0.wp.com/craphound.com/images/versiona1.jpg?w=350' alt="" style={{maxHeight: '100%', maxWidth: '100%'}}/>
                </div>

                <div className="four">
                    <img src='https://static.bhphoto.com/images/images500x500/1643045763_1683182.jpg' alt="" style={{maxHeight: '100%', maxWidth: '100%'}}/>
                </div>
                <div className="fourB">Four description</div>

                <div className="five">Five description</div>
                <div className="fiveB">                    
                    <img src={resizer('https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328214/Playdate-photo_hxdnpj.png', 750)} alt="" style={{maxHeight: '100%', maxWidth: '100%'}}/>
                </div>
                
            </div>
        </div>

        <Footer />

    </div>
  )
}

export default ProviderPremium