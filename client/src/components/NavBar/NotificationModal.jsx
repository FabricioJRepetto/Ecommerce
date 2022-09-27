import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ReactComponent as Bell } from '../../assets/svg/bell.svg'
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg'
import NotifCard from '../Profile/Notifications/NotifCard'
import './NotificationModal.css'

const NotificationModal = () => {
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [redDot, setRedDot] = useState(false)
    const { notificationList } = useSelector((state) => state.sessionReducer);

    useEffect(() => {
        if (notificationList) {
            const aux = notificationList.find(n => !n.seen);
            if (aux) setRedDot(true)
            else setRedDot(false)
        }
    }, [data, notificationList])
    

    useEffect(() => {
        (async ()=>{
            const {data} = await axios('/notifications/')
            if (data) setData(data)
            
            setLoading(false)
        })()
    }, [])
    

  return (

    <div className='notif-modal-container'>

        <div className='notif-modal-opener'></div>

        <div className='notif-modal-header'>
            {redDot && <span className='notif-dot component-fadeIn'></span>}
            <Bell className='bell-svg'/>
        </div>

        <div className='notif-modal-content'>
            {loading && 
                <div>
                    <Spinner />
                </div>}
            {data && data.length > 0
                ? <div>
                    <h2>notificaciones</h2>
                    <div>
                        {data.map(n => (
                            <NotifCard key={n._id} props={n} modal/>
                        ))}
                    </div>
                </div>
                : <div>
                    <h2>No tienes notificaciones</h2>
                </div>}
        </div>

    </div>
  )
}

export default NotificationModal