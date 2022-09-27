import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import LoaderBars from '../../common/LoaderBars';
import NotifCard from './NotifCard';

const NotificationsSection = ({loading, notif}) => {
    const navigate = useNavigate();
    // const [notif, setNotif] = useState(false);
    // const [loading, setLoading] = useState(true)

    useEffect(() => { //: quizas sea innecesario pedir acá    
    //   (async () => {
    //     const { data } = await axios('/notifications/');
    //     if (data) setNotif(data);
    //     console.log(data);
    //     setLoading(false);
    //   })();
    }, [])
    
  return (
    <div>
        <h1>Notifications</h1>
        {loading &&
            <>
                <LoaderBars />
            </>}
        {notif 
        ? <div>
            {notif?.map(n => (
                <NotifCard props={n}/>
            ))}
        </div>
        : <h1>No tienes notificaciones nuevas</h1>}
    </div>
  )
}

export default NotificationsSection