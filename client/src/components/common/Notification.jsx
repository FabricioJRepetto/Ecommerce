import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { close } from '../../Redux/reducer/notificationSlice';
import './Notification.css';

const Notification = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.notificationSlice.open);
    const { message, type, url } = useSelector((state) => state.notificationSlice.main);

    useEffect(() => {
            console.log(`sale notificacion: ${message}`);
            setTimeout(() => {
                closeNotification();
            }, 4000);
        // eslint-disable-next-line
    }, [isOpen]);

    let color = '';
    switch (type) {
        case 'error':
            color = 'red';
            break;
        case 'warning':
            color = 'orange';
            break;
        default: color = 'green';
            break;
    };

    const closeNotification = () => { 
        dispatch(close());
     };

    return (
        <div 
            style={{ borderLeft: `4px solid ${color}`}}
            onClick={() => ( url
                ? navigate(url)
                : closeNotification())}
            className={`notification-container ${isOpen && 'notif-open'}`}>
            <p className='notification-message'>{message}</p>
        </div>
    )
}

export default Notification