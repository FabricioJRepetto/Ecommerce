import React from 'react';
import { useSelector } from 'react-redux';
import Notification from './Notification';

import './Notification.css';

const NotificationMaster = () => {
    const notificationSlice = useSelector((state) => state.notificationSlice.main);
    
    return (
        <div className='notification-master-container'>
            <div id='notificator' className='notification-master-inner'>
                {React.Children.toArray(notificationSlice.map(e => 
                     e.status === 'new' && <Notification {...e}/>
                ))}
            </div>
        </div>
    )
}

export default NotificationMaster
