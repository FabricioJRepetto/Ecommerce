import React from 'react'
import { useNavigate } from 'react-router-dom';

const NotifCard = ({props}) => {
    const navigate = useNavigate();

    const {
        date,
        title,
        description,
        link,
        notif_type
    } = props;

    return (
        <div>
            <p>{date}</p>
            <h2>{title}</h2>
            <p>{description}</p>
            {link && <button onClick={()=>navigate(link)}>ir ...</button>}
        </div>
    )
}

export default NotifCard