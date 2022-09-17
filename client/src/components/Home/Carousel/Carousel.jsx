import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Controls from "./Controls";
import Indicators from "./Indicators";
import {
  resetCarouselIndex,
  updateCarouselIndex,
} from "../../../Redux/reducer/extraSlice";

import "./Carousel.css";

const Slider = (prop) => {
  const {
    images,
    interval = 5000,
    pausable = true,
    controls = false,
    indicators = false,
    pointer = false,
    width,
    height = "unset",
    autoplay = true,
    id = "slider",
    shareIndex = false,
  } = prop;

  const [currentIndex, setCurrentIndex] = useState(0);  
  const [move, setMove] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const slideInterval = useRef(null);
  const slider = useRef(null);

  useEffect(() => {
    slider.current = document.getElementById(id);
    // eslint-disable-next-line
  }, [slider]);

  // manejador del Intervalo
  const startSlideTimer = () => {
    if (autoplay && images.length > 1) {
      slideInterval.current = setInterval(() => {
        next(true);
      }, interval);
    }
  };
  const stopSlideTimer = () => {
    // importante preguntar si hay intervalo activo
    if (pausable && slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
    }
  };

  useEffect(() => {
    if (document.visibilityState === "visible") {
      !slideInterval.current && startSlideTimer();
    } else {
      stopSlideTimer();
    }
    return () => {
      stopSlideTimer();
      shareIndex && dispatch(resetCarouselIndex());
    };
    // eslint-disable-next-line
  }, [document.visibilityState]);

  const prev = () => {
    stopSlideTimer();
    setMove("prev");
  };

  const next = (auto) => {
    !auto && stopSlideTimer();
    setMove("next");
  };

  const switchIndex = (index) => {
    stopSlideTimer();
    let steps = Array.from(slider.current.children).findIndex(
      (e) => e.id === "img" + index
    );
    setMove(steps);

    if (steps === 6) prev();
    else {
      setCurrentIndex(index);
      shareIndex && dispatch(updateCarouselIndex(index));
      slider.current.style.transform = `translateX(${-steps * 100}%)`;
    }
  };

  // esta f se encarga de las acciones que se tienen que ejecutar DESPUES de que termine la animación
  const graber = () => {
    if (move === "next") {
      setMove(false);
      slider.current.style.transform = "none";
      slider.current.style.transition = "none";
      slider.current.appendChild(slider.current.firstElementChild);
      setTimeout(() => {
        slider.current.style.transition = "all .5s ease";
      });
    } else if (typeof move === "number") {
      for (let i = 0; i < move; i++) {
        slider.current.style.transform = "none";
        slider.current.style.transition = "none";
        slider.current.appendChild(slider.current.firstElementChild);
      }
      setTimeout(() => {
        slider.current.style.transition = "all .5s ease";
      });
      setMove(false);
    }
  };

  // este useEffect produce la transición necesaria segun el estado move
  useEffect(() => {
    if (move === "next") {
      let i = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(i);
      shareIndex && dispatch(updateCarouselIndex(i));
      slider.current.style.transform = "translateX(-100%)";
    } else if (move === "prev") {
      setMove(false);
      let i = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      setCurrentIndex(i);
      shareIndex && dispatch(updateCarouselIndex(i));
      slider.current.prepend(slider.current.lastElementChild);
      slider.current.style.transition = "none";
      slider.current.style.transform = "translateX(-100%)";
      setTimeout(() => {
        slider.current.style.transition = "all .5s ease";
        slider.current.style.transform = "translateX(0%)";
      });
    }
    // eslint-disable-next-line
  }, [move]);

  return (
    <div
      className="slide_container"
      onMouseEnter={pausable ? stopSlideTimer : undefined}
      onMouseLeave={pausable ? startSlideTimer : undefined}
    >
      <div className="slide" style={{ maxWidth: width, maxHeight: height }}>
        <div
          className="slide-inner"
          style={{ maxWidth: width }}
          id={id}
          ref={slider}
          onTransitionEnd={graber}
        >
          {images?.map((e, index) => (
            <div
              id={"img" + index}
              key={e.img}
              style={{ cursor: pointer ? "pointer" : "auto" }}
              onClick={() => navigate(e.url || "")}
              className="slide-item"
            >
                <img src={e.img} alt="img"  style={{ maxHeight: height, maxWidth: width }}/>
            </div>
          ))}
        </div>
        {indicators && (
          <Indicators
            images={images}
            currentIndex={currentIndex}
            switchIndex={switchIndex}
          />
        )}
        {controls && <Controls prev={prev} next={next} pausable={pausable} />}
      </div>
    </div>
  );
};

export default Slider;
