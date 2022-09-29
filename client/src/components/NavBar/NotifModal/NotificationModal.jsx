import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Bell } from '../../../assets/svg/bell.svg'
import { ReactComponent as Spinner } from '../../../assets/svg/spinner.svg'
import { loadNotifications } from '../../../Redux/reducer/sessionSlice'
import ChromaticText from '../../common/ChromaticText'
import NotifCard from '../../Profile/Notifications/NotifCard'

import './NotificationModal.css'

const NotificationModal = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [redDot, setRedDot] = useState(false);
    const { notificationList } = useSelector((state) => state.sessionReducer);

    useEffect(() => {
        if (notificationList) {
            const aux = notificationList.find(n => !n.seen);
            if (aux) setRedDot(true)
            else setRedDot(false)
        }
    }, [notificationList])

    const notifGetter = async () => { 
        if (!loading) {
            setLoading(true)
            const {data} = await axios('/notifications/')
            if (data) {
                dispatch(loadNotifications(data));
            }           
            setLoading(false)
        }
    };

  return (

    <div className='notif-modal-container' onMouseEnter={notifGetter}>

        <div className='notif-modal-opener'></div>

        <div className='notif-modal-header'>
            {redDot && <span className='notif-dot component-fadeIn'></span>}
            <Bell className='bell-svg'/>
        </div>

        <div className='notif-modal-content'>
            {loading 
                ? <div>
                    <Spinner />
                </div>
                : <div className="notif-modal-inner">
                    <div className="notif-modal-content-header">Notificaciones 
                        {loading && <span>
                            <Spinner style={{height: '1rem', transform: 'translateY(10%)'}}/>
                        </span>}
                    </div>
                    {notificationList.length > 0 
                        ? <div className="notif-modal-card-container">
                            {React.Children.toArray(
                                notificationList.map((e) => (
                                <NotifCard props={e} modal />
                                ))
                            )}
                        </div>
                        : <p className="modal-wishlist-empty">
                            No tienes notificaciones
                            </p>}

                        <div onClick={() => navigate("/profile/notifications")}
                            className="modal-card-all-favs pointer all-favs-text-container">
                            <ChromaticText text="Ver todas las notificaciones" />
                        </div>
                  </div>}
        </div>

    </div>
  )
}

export default NotificationModal