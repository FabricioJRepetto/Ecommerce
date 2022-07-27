import React from 'react';
import './about.css'

const AboutUs = () => {
  return (
    <div>
        <h1>About Us</h1>
        <div>

            <div>
                <div className="profile-avatar-container">                    
                    <img src="https://avatars.githubusercontent.com/u/93217713" alt="avatar" />
                </div>
                <h3> Fabricio Repetto</h3>
                <ul>
                    <li>
                        <a href='https://github.com/FabricioJRepetto' target='_blank' rel='noreferrer'>GitHub</a>
                    </li>
                    <li>
                        <a href='https://www.linkedin.com/in/fabricio-repetto/' target='_blank' rel='noreferrer'>LinkedIn</a>
                    </li>
                    <li>
                        <p>fabricio.j.repetto@gmail.com</p>
                    </li>
                </ul>
            </div>
            <br />
            <div>
                <div className="profile-avatar-container">                    
                    <img src="https://avatars.githubusercontent.com/u/93392994" alt="avatar" />
                </div>
                
                <h3> Fernando Ramirez</h3>
                <ul>
                    <li>
                        <a href='https://github.com/fereramirez' target='_blank' rel='noreferrer'>GitHub</a>
                    </li>
                    <li>
                        <a href='https://www.linkedin.com/in/fernando-e-ramirez/' target='_blank' rel='noreferrer'>LinkedIn</a>
                    </li>
                    <li>
                        <p>Mail</p>
                    </li>
                </ul>
            </div>

        </div>
    </div>
  )
}

export default AboutUs