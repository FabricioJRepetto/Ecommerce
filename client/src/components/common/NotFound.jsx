import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>Sitio no encontrado</h1>
      <div className="not-found-section"></div>
      <svg>
        <filter id="noise">
          <feTurbulence id="turbulence">
            <animate
              attributeName="baseFrequency"
              dur="50s"
              values="0.9 0.9;0.8 0.8; 0.9 0.9"
              repeatCount="indefinite"
            ></animate>
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="60"></feDisplacementMap>
        </filter>
      </svg>
    </div>
  );
};

export default NotFound;
