import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { close } from '../../Redux/reducer/notificationSlice';
import { ExternalLinkIcon } from "@chakra-ui/icons";
import sfxS from '../../assets/notif0.mp3';
import sfxW from '../../assets/notif1.mp3';
import sfxE from '../../assets/notif2.mp3';
import welcome from '../../assets/welcome.mp3';

import './Notification.css';

const Notification = (props) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [shrink, setShrink] = useState(false);
    const timeout = useRef(null);
    const dispatch = useDispatch();    
    
    const soundType = {
        soundSuccess: new Audio(sfxS),
        soundWarning: new Audio(sfxW),
        soundError: new Audio(sfxE),
        soundWelcome: new Audio(welcome)
    };

    const {
        message,
        type,
        url,
        id
    } = props;    

    let color = '';
    let sound = '';
    switch (type) {
        case 'error':
            color = 'red';
            sound = 'soundError'
            break;
        case 'warning':
            color = 'orange';
            sound = 'soundWarning'
            break;
        case 'success':
            color = 'green';
            sound = 'soundSuccess'
            break;
        case 'welcome':
            sound = 'soundWelcome'
            color = '#ffffff';
            break;
        default: color = 'blue';
                 sound = 'soundSuccess';
            break;
    };

    useEffect(() => {
        clearTimeout(timeout.current);
        startTimeout();

        soundType[sound].volume = type === 'welcome' ? 1 : 0.4;
        soundType[sound].play();

        setTimeout(() => {
            message && setIsOpen(true);            
        }, 100);
        // eslint-disable-next-line
    }, []);

    const startTimeout = () => { 
        if (type !== 'error') {
            timeout.current = setTimeout(() => {
                closeNotification();
            }, 6000);
        } else {
            timeout.current = setTimeout(() => {
                closeNotification();
            }, 10000);
        }
     };

    const closeNotification = (click) => {
        // url && click && navigate(url);
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
        <div className={`notification-card-area${shrink ? ' notif-shrink' : ''}`} 
            style={{pointerEvents: isOpen ? 'all' : 'none'}}>

           <div className='chromatic-container'>
                <div className={`notification-color-placeholder${isOpen ? ` notification-border-${color}`:''}`}></div>
                <div className={`notification-color${isOpen ? ' color-open':''}`}
                    style={{transitionDelay: `${(.08 / 3) * 1}s`, background: `hsl(0, 100%, 50%)`}}></div>
                <div className={`notification-color${isOpen ? ' color-open':''}`}
                    style={{transitionDelay: `${(.08 / 3) * 2}s`, background: `hsl(120, 100%, 50%)`}}></div>
                <div className={`notification-color${isOpen ? ' color-open':''}`}
                    style={{transitionDelay: `${(.08 / 3) * 3}s`, background: `hsl(240, 100%, 50%)`}}></div>
           </div>            

            <div className={`notification-container${isOpen ? ' notif-open':''}`}
                onClick={() => closeNotification(true)}>
                <div className='notification-inner'>
                    {type !== 'error' && <div className={`notification-timer${isOpen ? ' timer-active':''}`}></div>}
                    {url && <div onClick={()=>navigate(url)} className={`notification-seemore${isOpen ? ' seemore-visible':''}`}>
                            <ExternalLinkIcon />
                            <p>ir...</p>
                        </div>}
                    <div className='notification-message'>
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default Notification;
