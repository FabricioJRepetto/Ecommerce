import React, { useEffect } from 'react'
import { useState } from 'react'
import Footer from '../common/Footer'
import Carousel from '../Home/Carousel/Carousel'
import './ProviderStore.css'

const ProviderStore = () => {
    const images = [
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/9750_16688_wz1frg.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/8322_15233_xanjft.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661290053/9679_16615_q7wl6f.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/8552_15488_r0hefx.jpg',
            url: ''
        },
    ];
    const [visible, setVisible] = useState(true);
    const [scroll, setScroll] = useState()

    useEffect(() => {
        const scrollHandler = () => {
            setScroll(window.scrollY)
            window.scrollY > 200 && setVisible(true);
            window.scrollY < 200 && setVisible(false);
        }
        window.addEventListener('scroll', scrollHandler)
    
        return () => {
            window.removeEventListener('scroll', scrollHandler)
        }
    }, []);

    return (
        <div className='providerstore-container'>
            
            <div className='providerstore-echo-inner'>
                <p>PROVIDER</p>
                <p>PROVIDER</p>
                <p>PROVIDER</p>
            </div>
            <p className='providerstore-title'>STORE</p>

            <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1661210139/defe786a-5490-425a-b98d-3b8c2d1b7463_desktop_header-copy_algg64.jpg" alt="header"/>  

            <div className='providerstore-background'></div>

            <div className='storecards-container'>
                <div className='store-premium'>                
                    <Carousel images={images}
                        pointer
                        indicators
                        width='40vw'
                        height='100%' />
                    <div className='store-premium-text'>
                        <div>
                            <h1>Provider Premium</h1>
                            <p>Una selección exclusiva de los mejores productos para Provider store.</p>
                        </div>
                        <button className='g-white-button'>Ver más</button>
                    </div>
                </div>

                <div className='storecards-inner'>
                    <div className="storecard">Consolas</div>
                    <div className="storecard">Perifericos</div>
                    <div className="storecard">Audio</div>
                    <div className="storecard">Monitores</div>
                </div>
            </div>

            <Footer />
        </div>
  )
}

export default ProviderStore