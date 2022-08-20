import React, { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { close } from "../../Redux/reducer/notificationSlice";
import ChromaticText from "./ChromaticText";
import "./Notification.css";

import { ReactComponent as LinkIcon } from "../../assets/svg/link.svg";

const Notification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.notificationSlice.open);
  const { message, type, url } = useSelector(
    (state) => state.notificationSlice.main
  );
  const timeout = useRef(null);

  useEffect(() => {
    clearTimeout(timeout.current);
    startTimeout();
    // eslint-disable-next-line
  }, [isOpen]);

  let color = "";
  switch (type) {
    case "error":
      color = "red";
      break;
    case "warning":
      color = "orange";
      break;
    case "success":
      color = "green";
      break;
    default:
      color = "rgba(0, 0, 0, .3)";
      break;
  }

  const startTimeout = () => {
    if (type !== "error") {
      timeout.current = setTimeout(() => {
        closeNotification();
      }, 6000);
    }
  };

  const closeNotification = (click) => {
    url && click && navigate(url);
    dispatch(close());
    clearTimeout(timeout.current);
  };

  return (
    <div className={isOpen ? "notification-area" : ""}>
      <div className="chromatic-container">
        <div
          className={`notification-color-placeholder ${
            isOpen && `notification-border-${color}`
          }`}
        ></div>
        <div
          className={`notification-color ${isOpen && "color-open"}`}
          style={{
            transitionDelay: `${(0.08 / 3) * 1}s`,
            background: `hsl(0, 100%, 50%)`,
          }}
        ></div>
        <div
          className={`notification-color ${isOpen && "color-open"}`}
          style={{
            transitionDelay: `${(0.08 / 3) * 2}s`,
            background: `hsl(120, 100%, 50%)`,
          }}
        ></div>
        <div
          className={`notification-color ${isOpen && "color-open"}`}
          style={{
            transitionDelay: `${(0.08 / 3) * 3}s`,
            background: `hsl(240, 100%, 50%)`,
          }}
        ></div>
      </div>

      <div
        className={`notification-container ${isOpen && "notif-open"}`}
        onClick={() => closeNotification(true)}
      >
        <div className={`notification-inner`}>
          {type !== "error" && (
            <div
              className={`notification-timer ${isOpen && "timer-active"}`}
            ></div>
          )}
          {url && <LinkIcon className="link-svg" />}
          <div className="notification-message">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
