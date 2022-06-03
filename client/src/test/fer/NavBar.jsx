import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useSelector } from "react-redux";

const NavBar = () => {
  const token = useSelector((state) => state.sessionReducer.token);

  return (
    <div className="navBar">
      {!token ? (
        <NavLink to={"signin"}>
          <p>Log In</p>
        </NavLink>
      ) : (
        <NavLink to={"signout"}>
          <p>Log out</p>
        </NavLink>
      )}
      <NavLink to={"products"}>
        <p>Products</p>
      </NavLink>
      <NavLink to={"productForm"}>
        <p>Create Products</p>
      </NavLink>
      <NavLink to={"cart"}>
        <p>Cart</p>
      </NavLink>
    </div>
  );
};

export default NavBar;
