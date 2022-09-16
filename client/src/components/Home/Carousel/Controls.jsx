import React from "react";
import { ReactComponent as Arrow } from "../../../assets/svg/arrow-right.svg";

const Controls = ({ prev, next, start, stop, pausable }) => {
  return (
    <div>
      <button
        onClick={prev}
        className="carousel-control left"
        /* onMouseEnter={pausable ? stop : undefined}
        onMouseLeave={pausable ? start : undefined} */
      >
        <Arrow className="arrow left-arrow" />
      </button>
      <button
        onClick={next}
        className="carousel-control right"
        /* onMouseEnter={pausable ? stop : undefined}
        onMouseLeave={pausable ? start : undefined} */
      >
        <Arrow className="arrow" />
      </button>
    </div>
  );
};

export default Controls;
