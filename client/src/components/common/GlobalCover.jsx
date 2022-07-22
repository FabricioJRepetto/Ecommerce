import React, { useEffect, useState } from 'react';
import './GlobalCover.css';

const GlobalCover = () => {
    const [aux, setAux] = useState(false);

    useEffect(() => {
            setAux(true)
    }, []);

    return (
        <div className={`globalLoader ${aux && 'globalLoaded'}`}>
        </div>
    )
}

export default GlobalCover