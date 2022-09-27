import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const NotificationsSection = () => {
    const navigate = useNavigate();
    const [notif, setNotif] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => { //: quizas sea innecesario pedir acá    
      (async () => {
        const { data } = await axios('/notifications/');
        if (data) setNotif(data);
        console.log(data);
        setLoading(false);
      })();
    }, [])
    
  return (
    <div>
        <h1>Notifications</h1>
        {notif && !loading 
        ? <div>
            {notif?.map(n => (
                <div>
                    <p>{n.date}</p>
                    <h2>{n.title}</h2>
                    <p>{n.description}</p>
                    <button onClick={()=>navigate(n.link)}></button>
                </div>
            ))}
        </div>
        : <h1>No tienes notificaciones nuevas</h1>}
    </div>
  )
}

export default NotificationsSection