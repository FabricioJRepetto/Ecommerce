import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useSelector } from "react-redux";

const NavBar = () => {
  const session = useSelector((state) => state.sessionReducer.session);

  return (
    <div className="navBar">
      <NavLink to={"products"}>
        <p>Products</p>
      </NavLink>
      <NavLink to={"productForm"}>
        <p>Create Products</p>
      </NavLink>
      
      {!session ? (
        <NavLink to={"signin"}>
          <p>Log In</p>
        </NavLink>
      ) : (
        <>
            <NavLink to={"profile"}>
            <p>Profile</p>
            </NavLink>
            <NavLink to={"cart"}>
            <p>🛒</p>
            </NavLink>
        </>
      )}
    </div>
  );
};

export default NavBar;
