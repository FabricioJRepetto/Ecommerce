import { useEffect, useState } from 'react'
import { ReactComponent as Arrow } from '../../assets/svg/arrow-right.svg'
import './BackToTop.css'

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let scroller = document.getElementById("scroller");

        const scrollHandler = () => {
                scroller.scrollTop > 200 && setVisible(true);
                scroller.scrollTop < 200 && setVisible(false);
        }
        scroller.addEventListener('scroll', scrollHandler)
    
        return () => {
            scroller.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    const backToTop = () => {
        document.getElementById("scroller").scrollTo({
            top: 0,
            behavior: "smooth"
        })
    };

    return (
        <div className={`backtotop-button ${visible && 'visible-btt'}`} onClick={backToTop}>
            <Arrow className='icon-up'/>
        </div>
    )
}

export default BackToTop