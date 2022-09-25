import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNotification } from '../../hooks/useNotification'

const Comments = ({product_id, comments, allowed}) => {
    const notification = useNotification();
    const [calification, setCalification] = useState(0);
    const [text, setText] = useState('');

    const submitHandler = async () => { 
        console.log(calification)
        console.log(text)
        if (!text) {
            notification('No puedes enviar un comentario vacío.')
        } else if (text.length < 5) {
            notification('El texto no puede tener una longitud menor a 5 caracteres.')
        } else if (text.length > 500) {
            notification('El texto no puede tener una longitud mayor a 500 caracteres.')
        } else if (parseInt(calification) === 0) {
            notification('No puedes enviar un comentario sin calificación.')            
        } else {
            let body = {
                text,
                calification,
                product_id
            }
            const { data } = await axios.post('/comments', body);
            console.log(data);
        }
     }
    
  return (
    <div>
        <h1>caja de comentarios</h1>
        <h2>allowed: {allowed ? 'si' : 'no'}</h2>
        {allowed &&
            <div>
                <input type="number" min={0} max={5} onChange={(e)=>setCalification(e.target.value)}/>
                <textarea name="comment-text" cols="30" rows="10"
                    value={text}
                    onChange={(e)=>setText(e.target.value)}></textarea>
                <button onClick={submitHandler}> Commentar </button>
            </div>}
        <br/>
        {comments?.length > 0
            ? <div>{comments.map(c => (
                <div key={c.comment.user_id}>
                    <div>{c.user_data.name}</div>
                    <div>
                        <img src={c.user_data.avatar || require('../../assets/avatardefault.png')} alt="" />
                    </div>
                    <div>{c.comment.calification}</div>
                    <div>{c.comment.text}</div>
                    <div>{c.comment.date}</div>
                </div>
            ))}</div>
            : <h2>Aún sin comentarios</h2>
        }
    </div>
  )
}

export default Comments

/* 
    {
        user: {
            name,
            avatar
        },
        calification,
        text,
        date
    }
*/