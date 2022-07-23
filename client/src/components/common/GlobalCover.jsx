import React, { useEffect, useState } from 'react';
import './GlobalCover.css';

const GlobalCover = () => {
    const [aux, setAux] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setAux(true)            
        }, 100);
    }, []);

    return (
        <div className={`globalLoader ${aux && 'globalLoaded'}`}>
        </div>
    )
}

export default GlobalCover