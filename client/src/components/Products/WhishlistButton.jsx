import React from 'react'
import { ReactComponent as Fav } from '../../assets/svg/fav.svg'
import axios from 'axios';
import { loadWhishlist } from '../../Redux/reducer/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../../hooks/useNotification';
import './WhishlistButton.css'

export const WhishlistButton = ({prodId: id, size = 30, fav, visible}) => {
    const dispatch = useDispatch();
    const whishlist = useSelector((state) => state.cartReducer.whishlist);
    const session = useSelector((state) => state.sessionReducer.session);
    const [notification] = useNotification();

    const addToWhish = async (id) => {
        if (session) {
            if (!whishlist.includes(id)) {
                const { data } = await axios.post(`/whishlist/${id}`);
                console.log(data);
                dispatch(loadWhishlist(data.list?.products));
                notification(data.message, '/profile/whishlist', 'success');
                
            } else {
                const { data } = await axios.delete(`/whishlist/${id}`);
                console.log(data);
                dispatch(loadWhishlist(data.list?.products));
                notification(data.message, '', 'warning');
            }
        } else {
            notification('Log in to add products to your whishlist.', '/loginup', 'warning')
        }
   };

    return (
            <div className={`fav-button-container ${(fav || visible) && 'visible'}`}>
                <button 
                    style={{ height: size, width: size }}
                    onClick={() => addToWhish(id)}>
                    <Fav 
                        className={`fav-button-svg ${fav && 'faved'}`}
                        style={{ transform: 'scale(.6)' }}
                    />
                </button>
            </div>
    )
}