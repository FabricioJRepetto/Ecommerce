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
    const [notification] = useNotification();

    const addToWhish = async (id) => {
        if (!whishlist.includes(id)) {
            const { data } = await axios.post(`/whishlist/${id}`);
            console.log(data);
            dispatch(loadWhishlist(data.list?.id_list));
            notification(data.message, '', 'success');
            
        } else {
            const { data } = await axios.delete(`/whishlist/${id}`);
            console.log(data);
            dispatch(loadWhishlist(data.list?.id_list));
            notification(data.message, '', 'success');
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