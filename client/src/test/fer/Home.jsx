import { Routes, Route } from "react-router-dom";
import Cart from "./Cart";
import Products from "./Products";
import Signout from "./Signout";
import Signupin from "./Signupin";

const Home = () => {
  return (
    <Routes>
      <Route path="/signin" element={<Signupin />} />
      <Route path="/signout" element={<Signout />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default Home;
