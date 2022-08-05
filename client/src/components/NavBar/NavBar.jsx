import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
    loadApplied,
    loadFilters,
    loadProductsFound,
    loadProductsOwn,
    loadQuerys,
} from "../../Redux/reducer/productsSlice";

import "./NavBar.css";
import { ReactComponent as Cart } from "../../assets/svg/cart.svg";
import { ReactComponent as Fav } from "../../assets/svg/fav.svg";
import { ReactComponent as Avatar } from "../../assets/svg/avatar.svg";
import Signout from "../Session/Signout";
import WishlistModal from "../common/WishlistModal";
import { avatarResizer } from "../../helpers/resizer";
import { PowerGlitch } from 'powerglitch';
import { useEffect } from "react";
import { useRef } from "react";


const NavBar = () => {
  const session = useSelector((state) => state.sessionReducer.session);
  const username = useSelector((state) => state.sessionReducer.username);
  const avatar = useSelector((state) => state.sessionReducer.avatar);
  const cart = useSelector((state) => state.cartReducer.onCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileModal, setProfileModal] = useState(false);
  const [wishModal, setWishModal] = useState(false);
    const eldiv = useRef(null)

  useEffect(() => {    
    eldiv.current = document.querySelector('.glitch');
    console.log(eldiv);
    PowerGlitch.glitch(
        eldiv.current,
        {
            imageUrl: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1659650791/PROVIDER_LOGO_glitch_aberration_kt2hyv.png',
            backgroundColor: 'transparent',
            hideOverflow: false,
            timing: {
                duration: 10000,
                iterations: 'Infinity',
            },
            glitchTimeSpan: {
                start: 0.6,
                end: 0.7,
            },
            shake: {
                velocity: 15,
                amplitudeX: 0.1,
                amplitudeY: 0.2,
            },
            slice: {
                count: 3,
                velocity: 15,
                minHeight: 0.03,
                maxHeight: 0.15,
                hueRotate: true,
            },
        }
    )
    
    
  }, [])
  


  const querySearch = async (e) => {
    if (e.key === "Enter" && e.target.value) {
      if (session) {
        //: logear busqueda en el historial
        axios.post(`/history/search/${e.target.value}`);
      }
        dispatch(loadProductsOwn("loading"));
        dispatch(loadProductsFound("loading"));
        dispatch(loadFilters("loading"));
        dispatch(loadApplied('loading'));

        navigate("/results");
        dispatch(loadQuerys({q: e.target.value}));
    }
  };

  const logoClick = () => {
    dispatch(loadProductsOwn([]));
    dispatch(loadProductsFound([]));
    dispatch(loadFilters([]));
    document.getElementById("navbar-searchbar").value = "";
    navigate("/");
  };

  return (
    <div className="navBar">
      <div className="glitch" onClick={logoClick}>
        {/* <img
          onClick={logoClick}
          src={require("../../assets/provider-logo3.png")}
          alt="logo"
          className="logo glitch"
        /> */}
      </div>

      <div className="navbar-central-section">
        <input
          type="text"
          placeholder="search"
          onKeyUp={querySearch}
          id="navbar-searchbar"
        />

        <div className="navbar-central-subsection">
          <NavLink to={"products"}>
            <p className='provider-store'>Provider Store</p>
          </NavLink>

          <NavLink to={"about"}>
            <p>About Us</p>
          </NavLink>

          <NavLink to={'/'}>
            <p>Contact</p>
          </NavLink>

          <NavLink to={"admin"}>
            <p>ADMIN</p>
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
                className="navbar-profile-button"
                onMouseEnter={() => setProfileModal(true)}
                onMouseLeave={() => setProfileModal(false)}
              >
                {avatar ? (
                  <div className="navbar-avatar">
                    <img
                      src={avatarResizer(avatar)}
                      referrerPolicy="no-referrer"
                      alt="navbar-avatar"
                    />
                  </div>
                ) : (
                  <Avatar className="navbar-avatar-svg" />
                )}
                <p>{ username || 'Profile' }</p>

                <div className="navBar-modal-container">
                  <div className={`navbar-modal ${profileModal && "visible"}`}>
                    <div
                      className="navbar-modal-menu-container"
                      onClick={() => setProfileModal(false)}
                    >
                      <NavLink
                        to={"/profile/details"}
                        className="profile-modal-option"
                      >
                        Profile
                      </NavLink>

                      <NavLink
                        to={"/profile/address"}
                        className="profile-modal-option"
                      >
                        Address
                      </NavLink>

                      <NavLink
                        to={"/profile/wishlist"}
                        className="profile-modal-option"
                      >
                        Wishlist
                      </NavLink>

                      <NavLink
                        to={"/profile/orders"}
                        className="profile-modal-option"
                      >
                        Orders
                      </NavLink>

                      <NavLink
                        to={"/profile/history"}
                        className="profile-modal-option"
                      >
                        History
                      </NavLink>

                      <div className="profile-modal-option-button">
                        <Signout />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="navbar-wishlist-button"
                onMouseEnter={() => setWishModal(true)}
                onMouseLeave={() => setWishModal(false)}>
                <Fav className="wishlist-icon" />
                <div className="navBar-modal-container-w">
                    <div className={`navbar-modal-w ${wishModal && "visible"}`} >
                        {wishModal && <WishlistModal close={setWishModal} />}
                    </div>
                </div>
              </div>

              <NavLink to={"cart"} className="cart-icon-container">
                <Cart className="cart-icon" />
                <div className="cart-number">
                  {cart.length > 0
                    ? cart.length < 10
                      ? cart.length
                      : "9+"
                    : ""}
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
