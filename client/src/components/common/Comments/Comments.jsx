import React, { useState } from 'react'
import axios from 'axios'
import { useNotification } from '../../../hooks/useNotification'
import CommentCard from './CommentCard'
import CalificationInput from './CalificationInput'
import { useSelector } from 'react-redux'
import { ReactComponent as Spinner } from "../../../assets/svg/spinner.svg";

import './Comments.css'

const Comments = ({product_id, comments, allowed}) => {
    const notification = useNotification();
    const [allowComment, setAllowComment] = useState(allowed)
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allComments, setAllComments] = useState(comments);
    const [calification, setCalification] = useState(0);
    const [text, setText] = useState('');
    const [calPreview, setCalPreview] = useState(false)
    const { id, name: userName, avatar } = useSelector((state) => state.sessionReducer);

    const submitHandler = async () => { 
        if (!text) {
            notification('No puedes enviar un comentario vacío.','','warning')
        } else if (text.length < 5) {
            notification('El texto no puede tener una longitud menor a 5 caracteres.','','warning')
        } else if (text.length > 250) {
            notification('El texto no puede tener una longitud mayor a 250 caracteres.','','warning')
        } else if (parseInt(calification) === 0) {
            notification('No puedes enviar un comentario sin calificación.','','warning')            
        } else {
            let body = {
                text,
                calification,
                product_id
            }

            setLoading(true)

            let data = null;
            if (editMode) ({ data } = await axios.put('/comments', body));
            else ({ data } = await axios.post('/comments', body));            

            notification(data.message, '', data.error ? 'error' : 'success');

            if (!data.error) {
                if (editMode) {
                    allComments.forEach(c => {
                        if (c.comment.user_id === id) {
                            c.comment.text = text;
                            c.comment.calification = calification;                            
                        }
                    })
                    //setAllComments()
                    setEditMode(false)
                } else {
                    //! @@@@@@@@@@@@@@@@@@@
                    console.log(`%c ${data.new_id}`, 'color: orange; font-weight: bold;');
                    const newComment = {
                        comment: {
                            text,
                            calification,
                            user_id: id,
                            date: new Date().toLocaleString('es-Ar', { timeZone: "America/Buenos_Aires" }),
                            _id: data.new_id
                        },
                        user_data: {
                            userName,
                            avatar
                        }
                    }
                    console.log([newComment,...allComments]);
                    setAllComments([newComment,...allComments]);
                    setAllowComment(false)
                }

            }
            setLoading(false);
        }
     }

    const editComment = (id) => {
        let target = comments.find(c => c.comment._id === id);
        
        setCalification(target.comment.calification)
        setText(target.comment.text)

        setEditMode(true);
    }
    
  return (
    <div className='comments-section-container component-fadeIn'>
        {(allowComment || editMode) &&
            <div className='comments-section-input-box component-fadeIn'>
                {!loading 
                ? <>
                    <h2>Cuentanos algo sobre este producto</h2>

                    <CalificationInput 
                        calification={calification} 
                        setCalification={setCalification} 
                        setCalPreview={setCalPreview} 
                        calPreview={calPreview}/>

                    <textarea name="comment-text" maxLength={250} 
                        placeholder='Escribe una reseña' cols="50" rows="8"
                        value={text}
                        onChange={(e)=>setText(e.target.value)}></textarea>
                    <div>
                        <button className='g-white-button ' onClick={submitHandler}> Publicar </button>
                        {editMode && <button className='g-white-button secondary-button' onClick={()=>setEditMode(false)}> Cancelar </button>}
                    </div>
                </>
                : <>
                    <Spinner />
                </>
                }

            </div>}
        <br/>        
        {allComments?.length > 0
            ? <div>{allComments.map(c => (
                <CommentCard key={c.comment.user_id} props={c} 
                editable={c.comment.user_id === id} edit={editComment}/>                
            ))}</div>
            : <h2>Aún sin comentarios</h2>
        }
    </div>    
  )
}

export default Comments