import React from 'react'
import Calification from './Calification';
import { ReactComponent as Edit } from '../../../assets/svg/edit.svg';

const CommentCard = ({props, editable, edit}) => {
  return (
    <div className='comment-card-container'>
        {editable && <div className='comment-card-edit-button'
            onClick={edit}></div>}

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

            <div className="comment-card-date">{props.comment.date.split(' ')[0]}</div>
        </div>
    </div>
  )
}

export default CommentCard