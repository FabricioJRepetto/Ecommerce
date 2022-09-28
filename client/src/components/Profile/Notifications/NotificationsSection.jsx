import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import NotifCard from './NotifCard';
import { ReactComponent as Spinner } from '../../../assets/svg/spinner.svg';

import "./NotificationsSection.css";

const NotificationsSection = ({loading, notif, setNotif}) => {
    const [loadSource, setLoadSource] = useState(false);
    const { notificationList } = useSelector(state => state.sessionReducer)

    const [params] = useSearchParams(),
    query = params.get("id") || false;

    useEffect(() => {
        if (!loading) {
            setLoadSource(notif);
        } else if (notificationList.length > 0) {
            setLoadSource(notificationList);
        };
      // eslint-disable-next-line
    }, [])

  return (
    <div className='notifications-section-container'>
        <div className='notifications-section-title'>
            <h1>Notificaciones</h1>    
            {loading && <Spinner/>}        
        </div>
        
        {loadSource && loadSource.length > 0 &&
            <div className='notifications-section-cards-container'>
                {loadSource?.map(n => (
                    <NotifCard key={n._id} props={n} setNotif={setNotif} openByQ={query}/>
                ))}
            </div>}
        {(!loading && !loadSource) && <h2>No tienes notificaciones nuevas</h2>}
    </div>
  )
}

export default NotificationsSection