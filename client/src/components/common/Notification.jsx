import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { close } from '../../Redux/reducer/notificationSlice';
import './Notification.css';

import { ReactComponent as LinkIcon } from "../../assets/svg/link.svg";

const Notification = (props) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [shrink, setShrink] = useState(false);
    const timeout = useRef(null);
    const dispatch = useDispatch();
    // const isOpen = useState((state) => state.notificationSlice.open);
    // const { message, type, url } = useSelector((state) => state.notificationSlice.main);
    
    const {
        message,
        type,
        url,
        id
    } = props;

    useEffect(() => {
        clearTimeout(timeout.current);
        startTimeout();
        message && setIsOpen(true);
        // eslint-disable-next-line
    }, []);

    let color = '';
    switch (type) {
        case 'error':
            color = 'red';
            break;
        case 'warning':
            color = 'orange';
            break;
        case 'success':
            color = 'green';
            break;
        default: color = 'blue';
            break;
    };

    const startTimeout = () => { 
        if (type !== 'error') {
            timeout.current = setTimeout(() => {
                closeNotification();
            }, 6000);
        }
     };

    const closeNotification = (click) => {
        url && click && navigate(url);
        setIsOpen(false);
        clearTimeout(timeout.current);

        setTimeout(() => {
            setShrink(true);
        }, 500);

        setTimeout(() => {
            dispatch(close(id));
        }, 1000);
     };

    return (
        <div className={`notification-card-area ${shrink ? 'notif-shrink' : ''}`} 
            style={{pointerEvents: isOpen ? 'all' : 'none'}}>

           <div className='chromatic-container'>
                <div className={`notification-color-placeholder ${isOpen && `notification-border-${color}`}`}></div>
                <div className={`notification-color ${isOpen && 'color-open'}`}
                    style={{transitionDelay: `${(.08 / 3) * 1}s`, background: `hsl(0, 100%, 50%)`}}></div>
                <div className={`notification-color ${isOpen && 'color-open'}`}
                    style={{transitionDelay: `${(.08 / 3) * 2}s`, background: `hsl(120, 100%, 50%)`}}></div>
                <div className={`notification-color ${isOpen && 'color-open'}`}
                    style={{transitionDelay: `${(.08 / 3) * 3}s`, background: `hsl(240, 100%, 50%)`}}></div>
           </div>            

            <div className={`notification-container ${isOpen && 'notif-open'}`}
                onClick={() => closeNotification(true)}>
                <div className={`notification-inner`}>
                    {type !== 'error' && <div className={`notification-timer ${isOpen && 'timer-active'}`}></div>}
                    {url && <LinkIcon className='link-svg' />}
                    <div className='notification-message'>
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default Notification;
