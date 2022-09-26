import React, { useState } from 'react'
import axios from 'axios'
import { useNotification } from '../../../hooks/useNotification'
import CommentCard from './CommentCard'
import Calification from './Calification'
import { useSelector } from 'react-redux'
import './Comments.css'

const Comments = ({product_id, comments, allowed}) => {
    const notification = useNotification();
    const [editMode, setEditMode] = useState(allowed);
    const [loading, setLoading] = useState(false)
    const [calification, setCalification] = useState(0);
    const [text, setText] = useState('');
    const [calPreview, setCalPreview] = useState(false)
    const { id } = useSelector((state) => state.sessionReducer);
    
    console.log(id);
    console.log(comments);

    const submitHandler = async () => { 
        if (!text) {
            notification('No puedes enviar un comentario vacío.')
        } else if (text.length < 5) {
            notification('El texto no puede tener una longitud menor a 5 caracteres.')
        } else if (text.length > 250) {
            notification('El texto no puede tener una longitud mayor a 250 caracteres.')
        } else if (parseInt(calification) === 0) {
            notification('No puedes enviar un comentario sin calificación.')            
        } else {
            let body = {
                text,
                calification,
                product_id
            }
            setLoading(true)
            const { data } = await axios.post('/comments', body);
            data && setLoading(false);
            notification(data.message, '', data.error ? 'error' : 'success');
            if (!data.error) {
                //: cargar el comentario
            }
            console.log(data);
        }
     }

    const editComment = () => {

        setCalification()
        setText()

        setEditMode(true);
    }
    
  return (
    <div className='comments-section-container component-fadeIn'>
        {allowed &&
            <div className='comments-section-input-box component-fadeIn'>
                <h2>Cuentanos algo sobre este producto</h2>

                <div className='calification-input-container'>
                    <div className='calification-input-mode'>
                        <div className="calification-button cb1" 
                            onMouseEnter={()=>setCalPreview(1)} 
                            onMouseLeave={()=>setCalPreview(false)}
                            onClick={()=>setCalification(1)}></div>
                        <div className="calification-button cb2" 
                            onMouseEnter={()=>setCalPreview(2)} 
                            onMouseLeave={()=>setCalPreview(false)}
                            onClick={()=>setCalification(2)}></div>
                        <div className="calification-button cb3" 
                            onMouseEnter={()=>setCalPreview(3)} 
                            onMouseLeave={()=>setCalPreview(false)}
                            onClick={()=>setCalification(3)}></div>
                        <div className="calification-button cb4" 
                            onMouseEnter={()=>setCalPreview(4)} 
                            onMouseLeave={()=>setCalPreview(false)}
                            onClick={()=>setCalification(4)}></div>
                        <div className="calification-button cb5" 
                            onMouseEnter={()=>setCalPreview(5)} 
                            onMouseLeave={()=>setCalPreview(false)}
                            onClick={()=>setCalification(5)}></div>
                        <Calification num={calPreview || calification} />
                    </div>
                </div>

                <textarea name="comment-text" maxLength={250} placeholder='Escribe una reseña' cols="50" rows="8"
                    value={text}
                    onChange={(e)=>setText(e.target.value)}></textarea>
                <button className='g-white-button ' onClick={submitHandler}> Publicar </button>
            </div>}
        <br/>        
        {comments?.length > 0
            ? <div>{comments.map(c => (
                <CommentCard key={c.comment.user_id} props={c} editable={c.comment.user_id === id} edit={editComment}/>                
            ))}</div>
            : <h2>Aún sin comentarios</h2>
        }
    </div>    
  )
}

export default Comments