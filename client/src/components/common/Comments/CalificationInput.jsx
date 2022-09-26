import React from 'react'
import Calification from './Calification'

const CalificationInput = ({setCalPreview, setCalification, calification, calPreview}) => {
  return (
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
                        <Calification num={calPreview || calification} input/>
                    </div>
                </div>
  )
}

export default CalificationInput