import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { useVerifyAdmin } from "../../hooks/useVerifyAdmin";

const AdminLayout = () => {
  const [notification] = useNotification();
  useVerifyAdmin();
  return (
    <div>
      <button onClick={() => notification("test notif standard", "", "")}>
        Standard
      </button>
      <button onClick={() => notification("test notif success", "", "success")}>
        Success
      </button>
      <button
        onClick={() => notification("test notif error", "/admin", "error")}
      >
        Error
      </button>
      <button onClick={() => notification("test notif warning", "", "warning")}>
        Warning
      </button>
      <nav>
        <Link to="/admin/metrics">
          <h3>Métricas</h3>
        </Link>
        <Link to="/admin/products">
          <h3>Productos</h3>
        </Link>
        <Link to="/admin/productForm">
          <h3>Crear</h3>
        </Link>
        <Link to="/admin/users">
          <h3>Usuarios</h3>
        </Link>
        <Link to="/admin/orders">
          <h3>Compras</h3>
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
