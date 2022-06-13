import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useSelector } from "react-redux";

const NavBar = () => {
  const session = useSelector((state) => state.sessionReducer.session);

  return (
    <div className="navBar">
      {!session ? (
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
