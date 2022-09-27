import LoaderBars from '../../common/LoaderBars';
import NotifCard from './NotifCard';

import "./NotificationsSection.css";

const NotificationsSection = ({loading, notif, setNotif}) => {    
  return (
    <div className='notifications-section-container'>
        <h1>Notificaciones</h1>
        
        {loading &&
            <>
                <LoaderBars />
            </>}
        {notif && notif.length > 0 &&
            <div className='notifications-section-cards-container'>
                {notif?.map(n => (
                    <NotifCard key={n._id} props={n} setNotif={setNotif} />
                ))}
            </div>}
        {!loading && !notif && <h2>No tienes notificaciones nuevas</h2>}
    </div>
  )
}

export default NotificationsSection