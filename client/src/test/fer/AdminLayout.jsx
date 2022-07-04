import React from "react";
import { Link, Outlet, Routes, Route } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <nav>
        <Link to="/admin/products">Products</Link>
      </nav>
      <Outlet />
      {/* <Routes>
        <Route path="/products" element={<Products />} />
      </Routes> */}
    </div>
  );
};

export default AdminLayout;
