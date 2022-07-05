import React from "react";
import { Link, Outlet, Routes, Route } from "react-router-dom";
import { useVerifyAdmin } from "../../hooks/useVerifyAdmin";

const AdminLayout = () => {
  useVerifyAdmin();
  return (
    <div>
      <nav>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
      </nav>
      <Outlet />
      {/* <Routes>
        <Route path="/products" element={<Products />} />
      </Routes> */}
    </div>
  );
};

export default AdminLayout;
