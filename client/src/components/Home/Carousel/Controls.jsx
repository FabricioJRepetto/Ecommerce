import React from "react";
import { ReactComponent as Arrow } from "../../../assets/svg/arrow-right.svg";

const Controls = ({ prev, next }) => {
  return (
    <div>
      <button onClick={prev} className="carousel-control left">
        <Arrow className="arrow left-arrow" />
      </button>
      <button onClick={next} className="carousel-control right">
        <Arrow className="arrow" />
      </button>
    </div>
  );
};

export default Controls;
