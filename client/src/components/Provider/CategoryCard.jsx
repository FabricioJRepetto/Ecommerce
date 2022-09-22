import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loadQuerys } from '../../Redux/reducer/productsSlice'
import { PowerGlitch } from "powerglitch";

import './CategoryCard.css'

const CategoryCard = ({route, image, text, hover = false, onClick = false}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const goProducts = (code) => {
        dispatch(loadQuerys({ category: code }));
        navigate(`/results/?category=${code}`);
    };

    const correctOutline = {
        COMPUTACIÓN: {
            class: 'ccou-pc', 
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1663477028/category-cards-03-02_hbtbyn.png'
        },
        VIDEOJUEGOS: {
            class: 'ccou-games', 
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1663477849/category-cards-02-02_axpx3x.png'
        },
        AUDIO: {
            class: 'ccou-audio', 
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1663477312/category-cards-04-02_ld5nkv.png'
        },
        CÁMARAS: {
            class: 'ccou-cams', 
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1663477614/category-cards-04-05-02_y2sqmx.png'
        }
    }
    
    useEffect(() => {
      if (hover) {
        const outline = document.getElementById(`test-${text}`);
        PowerGlitch.glitch(outline, {
          imageUrl: correctOutline[text].img,
          backgroundColor: "transparent",
          hideOverflow: false,
          timing: {
            duration: 3000,
            iterations: "Infinity",
          },
          glitchTimeSpan: {
            start: 0,
            end: 1,
          },
          shake: {
            velocity: 50,
            amplitudeX: 0.7,
            amplitudeY: 0.7,
          },
          slice: {
            count: 8,
            velocity: 15,
            minHeight: 0.03,
            maxHeight: 0.15,
            hueRotate: true,
          },
        })
      }
      // eslint-disable-next-line
    }, [])
    

    return (
        <div className='categorycard-outer' onClick={() => onClick ? onClick() : goProducts(route)}>
            {hover && <div id={`test-${text}`} className={`ccou-master ${correctOutline[text].class}`}></div>}

            <div className='categorycard-container' >
                <img src={image} alt="category img" />
                <div className='categorycard-special-bg'></div>
                <div className='categorycard-footer'>
                    <p>{text}</p>
                    <span>{`ver productos >`}</span>
                </div>
            </div>
        </div>
    )
}

export default CategoryCard