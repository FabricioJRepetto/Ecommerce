import React, { useState } from 'react'
import axios from 'axios'
import { useNotification } from '../../../hooks/useNotification'
import CommentCard from './CommentCard'
import CalificationInput from './CalificationInput'
import { useSelector } from 'react-redux'
import { ReactComponent as Spinner } from "../../../assets/svg/spinner.svg";

import './Comments.css'
import { useEffect } from 'react'

const Comments = ({product_id, comments, allowed}) => {
    const notification = useNotification();
    const [allowComment, setAllowComment] = useState(allowed)
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allComments, setAllComments] = useState(false);
    const [calification, setCalification] = useState(0);
    const [text, setText] = useState('');
    const [calPreview, setCalPreview] = useState(false)
    const { id, name: userName, avatar } = useSelector((state) => state.sessionReducer);

    useEffect(() => { //? mover el comentario del usuario al principio
        let index = comments.findIndex(c => c.comment.user_id === id);
        let aux = [...comments];
        let target = comments[index]
        aux.splice(aux.length, 0, target);
        aux.splice(index, 1);

        setAllComments(aux)
      // eslint-disable-next-line
    }, [])

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
                    setEditMode(false)
                } else {
                    const newComment = {
                        comment: {
                            text,
                            calification,
                            user_id: id,
                            date: new Date().toLocaleString('es-Ar', { timeZone: "America/Buenos_Aires" }),
                            _id: data.new_id
                        },
                        user_data: {
                            name: userName,
                            avatar
                        }
                    }
                    setAllComments([...allComments, newComment]);
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

        <div className='comments-section-header'>
            <h1>OPINIONES</h1>
            {
                <div className={`comments-section-input-box ${(allowComment || editMode) ? 'comment-fadeIn' : 'comment-fadeOut'}`}>
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
                        <div className='comment-button-container'>
                            <button className='g-white-button ' onClick={submitHandler}> Publicar </button>
                            {editMode && <button className='g-white-button secondary-button' onClick={()=>setEditMode(false)}> Cancelar </button>}
                        </div>
                    </>
                    : <>
                        <Spinner className='spinner-test'/>
                    </>
                    }
                </div>}
        </div>

        {allComments?.length > 0
            ? <div className='comments-container'>{allComments.map(c => (
                <CommentCard key={c.comment.user_id} props={c} 
                editable={c.comment.user_id === id} edit={editComment} editing={editMode}/>                
            ))}</div>
            : <h2 className='comments-no-comments'>Este producto aún no tiene opiniones</h2>
        }
    </div>    
  )
}

export default Comments