import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useVerifyAdmin } from "../../hooks/useVerifyAdmin";
import "./AdminLayout.css";
//import { useNotification } from "../../hooks/useNotification";

const AdminLayout = () => {
  useVerifyAdmin();
  const [openMenu, setOpenMenu] = useState(false);
  // const notification = useNotification();

  return (
    <div className="admin-layout-container component-fadeIn">
      <div
        className={`navbar-menu-mobile-background ${
          !openMenu
            ? "hide-menu-mobile-background"
            : "profile-menu-mobile-background"
        }`}
        onClick={() => setOpenMenu(false)}
      ></div>
      <div className="admin-menu-placeholder"></div>
      <div className={`admin-menu${openMenu ? " admin-menu-opened" : ""}`}>
        <div className="admin-menu-options-container">
          <Link to="/admin/metrics" onClick={() => setOpenMenu(false)}>
            <h3>Métricas</h3>
          </Link>
          <Link to="/admin/products" onClick={() => setOpenMenu(false)}>
            <h3>Productos</h3>
          </Link>
          <Link to="/admin/create" onClick={() => setOpenMenu(false)}>
            <h3>Publicar</h3>
          </Link>
          <Link to="/admin/users" onClick={() => setOpenMenu(false)}>
            <h3>Usuarios</h3>
          </Link>
          <Link to="/admin/orders" onClick={() => setOpenMenu(false)}>
            <h3>Órdenes</h3>
          </Link>
        </div>
        <div
          className="admin-menu-open-button"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <div
            className={`admin-menu-top-arrow${
              openMenu ? " admin-menu-top-arrow-open" : ""
            }`}
          ></div>
          <div
            className={`admin-menu-bottom-arrow${
              openMenu ? " admin-menu-bottom-arrow-open" : ""
            }`}
          ></div>
        </div>
      </div>

      {/* <div className="buttonssss">
        <button onClick={() => notification("test notif standard", "", "")}>
          Standard
        </button>
        <button
          onClick={() => notification("test notif success", "", "success")}
        >
          Success
        </button>
        <button
          onClick={() => notification("test notif error", "/admin", "error")}
        >
          Error
        </button>
        <button
          onClick={() => notification("test notif warning", "", "warning")}
        >
          Warning
        </button>
      </div> */}

      <div className="admin-option-selected-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
