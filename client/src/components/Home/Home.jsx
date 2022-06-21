import React from 'react'

const Home = () => {

    return (
        <>
            <h1>Home</h1>
            <div>
                <p>Banner Ofertas</p>
                <img src={require('../../assets/banner/bannertest.webp')} alt="" />
            </div>
            <div>
                <p>Categorias</p>
                <button>😀</button>
                <button>😋</button>
                <button>😎</button>
                <button>🤩</button>
                <button>🥰</button>
                <button>🤑</button>
            </div>
            <div>productos random</div>
            <div>footer</div>
        </>
    )
};

export default Home