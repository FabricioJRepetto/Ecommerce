import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./NavBar.css";

const NavBar = () => {
    const session = useSelector((state) => state.sessionReducer.session);
    const cart = useSelector((state) => state.cartReducer.main);
    const navigate =useNavigate();

    return (
        <div className="navBar">
            <h1 onClick={()=>navigate("/")}>provider!</h1>
                
                <input type="text" placeholder="search" />
                
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
                    <p>🛒{cart > 0 && cart}</p>
                    </NavLink>
                </>
                )}
        </div>
    );
};

export default NavBar;
