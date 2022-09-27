import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadNotifications } from '../../../Redux/reducer/sessionSlice';
import {ReactComponent as Delete } from '../../../assets/svg/trash.svg';

import './NotifCard.css';

const NotifCard = ({props, setNotif, modal = false}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [seen, setSeen] = useState(props.seen);
    const [deleting, setDeleting] = useState(false)

    const {
        date,
        title,
        description,
        link,
        notif_type
    } = props;

    const correctType = {
        default: 'notiftype-blue',
        success: 'notiftype-green',
        warning: 'notiftype-orange',
        error: 'notiftype-red'
    }
    const dotType = {
        default: 'notiftype-circle-blue',
        success: 'notiftype-circle-green',
        warning: 'notiftype-circle-orange',
        error: 'notiftype-circle-red'
    }
    const unseenStyle = {
        background: 'linear-gradient(135deg, #151515 35%, #202020 52%, #303030 60%, #151515 65%)',
        backgroundSize: '400%',
        animation: 'loaderSwipeAnim2 3s cubic-bezier(0.4, 0.0, 0.2, 1) infinite'
    }

    const handleNotifClick = async () => { 
        setOpen(!open)
        if (!seen) {
            setSeen(true)
            const {data} = await axios.put(`/notifications/${props._id}`)
            dispatch(loadNotifications(data.notif_list));
        }
     }
     const handleNotifDelete = async (e) => {
        e.stopPropagation()
        const {data} = await axios.delete(`/notifications/${props._id}`);
        if (!data.error) {
            setDeleting(true)

            setTimeout(() => {
                setNotif(data.notif_list);
                dispatch(loadNotifications(data.notif_list));                
            }, 300);
        }
        
      }

    return (
        <div className={`notifcard-container component-fadeIn ${deleting && 'card-fadein'}`} onClick={handleNotifClick}>
            <div className='notifcard-header' style={seen ? {background: '#070707'} : unseenStyle }>
                <div>
                    <div className={`notifcard-type ${dotType[notif_type]}`}></div>
                    <div className={`notifcard-type-border ${!seen && correctType[notif_type]}`}></div>
                    <h2>{title}</h2>
                </div>

                <p>{date.replace(', ', ' | ').slice(0,-3)}</p>
            </div>
            
            <div className={`notifcard-body ${open && 'notifcard-body-open'}`}>
                <div className={`notifcard-desc ${modal && 'notifcard-desc-modal'}`}>
                    <p>{description}</p>
                </div>

                <div className='notifcard-buttons'>
                    {link && !modal &&  <button className='g-white-button' onClick={()=>navigate(link)}>ir ...</button>}
                    {!modal && <span className="address-delete-button-container"
                        onClick={(e)=>handleNotifDelete(e)}>
                        <Delete />
                        <span className="address-delete-gradient"></span>
                    </span>}
                </div>

            </div>          
        </div>
    )
}

export default NotifCard;