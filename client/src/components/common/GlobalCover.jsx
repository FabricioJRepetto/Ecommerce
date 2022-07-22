import React, { useEffect, useState, useRef } from 'react'
import './GlobalCover.css'

const GlobalCover = () => {
    const [aux, setAux] = useState(false);
    // const timer = useRef(null);

    useEffect(() => {
        setAux(true)
        // timer.current = setTimeout(() => {
        // }, 500);
    }, []);

    return (
        <div className={`globalLoader ${aux && 'globalLoaded'}`}></div>
    )
}

export default GlobalCover