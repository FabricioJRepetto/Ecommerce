import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useVerifyAdmin } from "../../hooks/useVerifyAdmin";

const AdminLayout = () => {
  useVerifyAdmin();
  return (
    <div>
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
          <h3>Órdenes</h3>
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
