import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./NavBar.css";

import { ReactComponent as Cart } from "../../assets/svg/cart.svg";
import { ReactComponent as Fav } from "../../assets/svg/fav.svg";
import { ReactComponent as Avatar } from "../../assets/svg/avatar.svg";
import { loadProductsFound, loadProductsOwn } from "../../Redux/reducer/productsSlice";
import Signout from "../Session/Signout";
import { useEffect } from "react";

const NavBar = () => {
    const { session, avatar } = useSelector((state) => state.sessionReducer);
    const cart = useSelector((state) => state.cartReducer.onCart);
    const navigate =useNavigate();
    const dispatch = useDispatch();    

    const [profileModal, setProfileModal] = useState(false);
    

    const querySearch = async (e) => { 
        if (e.key === 'Enter' && e.target.value) {
            if (session) {
                //: logear busqueda en el historial
                axios.post(`/history/search/${e.target.value}`);
            }
            
            dispatch(loadProductsOwn('loading'));
            dispatch(loadProductsFound('loading'));
            navigate('/results');
            const { data } = await axios(`/product/search/?q=${e.target.value}`);
            console.log(data);
            dispatch(loadProductsOwn(data.db));
            dispatch(loadProductsFound(data.meli));
        }
     }

     const logoClick = () => {
        dispatch(loadProductsOwn([]));
        dispatch(loadProductsFound([]));
        document.getElementById('navbar-searchbar').value = '';
        navigate("/");
      }

    return (
        <div className="navBar">
            <div className="navbar-logo-section">
                <img onClick={logoClick} src={require('../../assets/provider-logo.png')} alt="logo"  className="logo"/>
            </div>
                    
                <div className="navbar-central-section">
                    <input type="text" placeholder="search" 
                    onKeyUp={querySearch} id='navbar-searchbar'/>
                    
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
                                <p>Log In / Sign in</p>
                            </NavLink>
                            ) : (
                                <>
                                    <div 
                                        className='navbar-profile-button'
                                        onMouseEnter={() => setProfileModal(true)}
                                        onMouseLeave={() => setProfileModal(false)}>
                                        
                                            { avatar
                                            ? <div className="navbar-avatar">
                                                <img src={avatar} 
                                                referrerPolicy="no-referrer"
                                                alt="navbar-avatar" />
                                                </div>
                                            : <Avatar className="navbar-avatar-svg"/>}

                                            <p>Profile</p>

                                            <div className="navBar-modal-container">
                                                <div className={`navbar-modal ${profileModal && 'visible'}`}>

                                                    <div className="navbar-modal-menu-container"
                                                        onClick={() => setProfileModal(false)}>
                                                        <NavLink to={"/profile/details"} className='profile-modal-option'>Profile</NavLink>
                                                        
                                                        <NavLink to={"/profile/orders"} className='profile-modal-option'>Orders</NavLink>
                                                        
                                                        <NavLink to={"/profile/history"} className='profile-modal-option'>History</NavLink>
                                                        
                                                        <NavLink to={"/profile/address"} className='profile-modal-option'>Address</NavLink>
                                                        

                                                        <div className='profile-modal-option-button'>
                                                            <Signout />
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        
                                    </div>

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
