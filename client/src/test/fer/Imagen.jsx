import React from 'react'

const Imagen = () => {
  return (
        <div>
            <img src={require('../../mono.jpg')} alt='mono' height={550}/>
            <iframe title={'strnger things 4 theme'}  src={"https://open.spotify.com/embed/track/75FEaRjZTKLhTrFGsfMUXR?utm_source=generator"} width={900} height={380} frameBorder={0} allow={"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"}/>
        </div>
  )
}

export default Imagen