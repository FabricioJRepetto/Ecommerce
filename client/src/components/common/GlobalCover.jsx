import React, { useEffect, useState, useRef } from 'react'
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg';
import './GlobalCover.css'


const GlobalCover = () => {
    const [aux, setAux] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
            setAux(true)
        // timer.current = setTimeout(() => {
        // }, 200);
    }, []);

    return (
        <div className={`globalLoader ${aux && 'globalLoaded'}`}>
            <Spinner className='global-spinner'/>
        </div>
    )
}

export default GlobalCover