import React, { useEffect, useState, useRef } from 'react'
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg';
import './GlobalCover.css'


const GlobalCover = () => {
    const [aux, setAux] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        timer.current = setTimeout(() => {
            setAux(true)
        }, 2000);
    }, []);

    return (
        <div className={`globalLoader ${aux && 'globalLoaded'}`}>
            <Spinner className='global-spinner'/>
        </div>
    )
}

export default GlobalCover