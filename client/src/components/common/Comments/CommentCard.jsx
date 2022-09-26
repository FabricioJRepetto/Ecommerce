import React from 'react'
import Calification from './Calification';

const CommentCard = ({props, editable, edit}) => {

    const dateGetter = (str) => { 
        var rx = /^\d{1,2}\/\d{1,2}\/\d{4}/g;
        var arr = rx.exec(str);
        return arr[0]; 
     }

    return (
        <div className='comment-card-container'>
            {editable && <div className='comment-card-edit-button'
                onClick={()=>edit(props.comment._id)}></div>}

            <div key={props.comment.user_id}>
                <div className="comment-card-header">

                    <div className='comment-user-data'>
                        <div className='comment-card-image-container'>
                            <img src={props.user_data.avatar || require('../../../assets/avatardefault.png')} alt="user avatar" />
                        </div>
                        <h2>{props.user_data.name}</h2>
                    </div>
                    <Calification num={props.comment.calification}/>                
                </div>

                <div className="comment-card-text">{props.comment.text}</div>

                <div className="comment-card-date">{dateGetter(props.comment.date)}</div>
            </div>
        </div>
    )
}

export default CommentCard