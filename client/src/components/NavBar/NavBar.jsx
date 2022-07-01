import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./NavBar.css";

import { ReactComponent as Cart } from "../../assets/svg/cart.svg";
import { ReactComponent as Fav } from "../../assets/svg/fav.svg";
import { ReactComponent as Avatar } from "../../assets/svg/avatar.svg";

const NavBar = () => {
    const { session, avatar } = useSelector((state) => state.sessionReducer);
    const cart = useSelector((state) => state.cartReducer.onCart);
    const navigate =useNavigate();

    const meliSearch = async (e) => { 
        if (e.key === 'Enter') {
            //: loguear busqueda en el historial
            console.log(e.target.value);
            const {data} = await axios(`/meli/search/${e.target.value}`);
            console.log(`respuesta: ${data}`)
        }
     }

    return (
        <div className="navBar">
            <div className="navbar-logo-section">
                {/*<h1 onClick={()=>navigate("/")}>provider!</h1>*/}
                <img onClick={()=>navigate("/")} src={require('../../assets/provider-logo.png')} alt="logo"  className="logo"/>
            </div>
                    
                <div className="navbar-central-section">
                    <input type="text" placeholder="search" 
                    onKeyUp={meliSearch}/>
                    
                    <div className="navbar-central-subsection">

                        <NavLink to={"products"}>
                            <p>Products</p>
                        </NavLink>

                        <NavLink to={"productForm"}>
                            <p>Create Products</p>
                        </NavLink>

                    </div>
                </div>

                <div className="navbar-profile-container">
                        <div className="navbar-profile-section">
                            {!session ? (
                            <NavLink to={"signin"}>
                                <p>Log In</p>
                            </NavLink>
                            ) : (
                                <>
                                    <NavLink to={"/profile/details"} className='navbar-profile-button'>
                                        { avatar
                                        ? <div className="navbar-avatar">
                                            <img src={avatar} 
                                            referrerPolicy="no-referrer"
                                            alt="navbar-avatar" />
                                            </div>
                                        : <Avatar className="navbar-avatar-svg"/>}
                                        <p>Profile</p>
                                    </NavLink>

                                    <NavLink to={"/profile/whishlist"}>
                                        <Fav className='whishlist-icon'/>
                                    </NavLink>

                                    <NavLink to={"cart"}
                                        className="cart-icon-container">
                                            <Cart className='cart-icon'/>
                                            <div className="cart-number">
                                                {cart.length > 0 
                                                    ? cart.length < 10 
                                                        ? cart.length
                                                        : '9+'
                                                    : ''}
                                            </div>
                                    </NavLink>
                                </>
                            )}
                        </div>
                </div>                
        </div>
    );
};

export default NavBar;
