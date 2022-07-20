import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import ModalCard from '../Products/ModalCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './WishlistModal.css';

const WishlistModal = ({ close }) => {
    const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.cartReducer);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data } = await axios('/wishlist');
            setData(data);
            setLoading(false);
        })();
    }, [wishlist]);

    return (
        <div className='card-modal-container'>
            {loading
            ? <div className='modal-card-loading'>
                <Spinner />
               </div>
            : <div className='wishlist-modal-container'>
                <div className='modal-card-header'>Favoritos</div>
                {data.products.length > 0  
                   ? <div>{React.Children.toArray(
                        data?.products.map(e => (
                            <ModalCard 
                                productData={e}
                                fav
                                close={close}
                            />
                        ))
                    )}</div>
                  : <p>sin favoritos</p>
                }
                <div 
                    onClick={() => navigate('/profile/wishlist')}
                    className='modal-card-all-favs pointer'
                    >Ver todos los fav</div>
            </div>}
        </div>
    )
}

export default WishlistModal