import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Notification from "./Notification";

import "./Notification.css";

const NotificationMaster = () => {
  const [notificatorChildren, setNotificatorChildren] = useState(false);
  const notificationSlice = useSelector(
    (state) => state.notificationSlice.main
  );

  useEffect(() => {
    const notificator = document.getElementById("notificator");
    if (notificator) {
      console.log(notificator.hasChildNodes());
      setNotificatorChildren(notificator.hasChildNodes());
    }
  }, [notificationSlice]);

  return (
    <div
      className={`notification-master-container${
        !notificatorChildren ? " notification-master-container-hide" : ""
      }`}
    >
      <div id="notificator" className="notification-master-inner">
        {React.Children.toArray(
          notificationSlice.map(
            (e) => e.status === "new" && <Notification {...e} />
          )
        )}
      </div>
      {/* PRUEBA CARGA FUENTES // INDEX.CSS LINEA 352 */}
      <span className="load-font font-1">P</span>
      <span className="load-font font-2">R</span>
      <span className="load-font font-3">O</span>
      <span className="load-font font-4">V</span>
      <span className="load-font font-5">I</span>
      <span className="load-font font-6">D</span>
      <span className="load-font font-7">E</span>
      <span className="load-font font-8">R</span>
    </div>
  );
};

export default NotificationMaster;
