import { useState, useEffect, useRef } from "react";
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
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { ReactComponent as Cart } from "../../assets/svg/cart.svg";
import { ReactComponent as Fav } from "../../assets/svg/fav.svg";
import { ReactComponent as Avatar } from "../../assets/svg/avatar.svg";
import Signout from "../Session/Signout";
import WishlistModal from "../common/WishlistModal";
import { avatarResizer } from "../../helpers/resizer";
import { PowerGlitch } from "powerglitch";
import Signupin from "../Session/Signupin";
import "./NavBar.css";
import "../../App.css";
import { useSignout } from "../../hooks/useSignout";

const NavBar = () => {
  const { session, username, avatar } = useSelector(
    (state) => state.sessionReducer
  );
  const cart = useSelector((state) => state.cartReducer.onCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileModal, setProfileModal] = useState(false);
  const [wishModal, setWishModal] = useState(false);
  const [productToSearch, setProductToSearch] = useState("");
  const signOut = useSignout();
  const eldiv = useRef(null);

  useEffect(() => {
    eldiv.current = document.querySelector(".glitch");
    PowerGlitch.glitch(eldiv.current, {
      imageUrl:
        "https://res.cloudinary.com/dsyjj0sch/image/upload/v1659650791/PROVIDER_LOGO_glitch_aberration_kt2hyv.png",
      backgroundColor: "transparent",
      hideOverflow: false,
      timing: {
        duration: 10000,
        iterations: "Infinity",
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
    });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (session) {
      //: logear busqueda en el historial
      axios.post(`/history/search/${productToSearch}`);
    }
    dispatch(loadProductsOwn("loading"));
    dispatch(loadProductsFound("loading"));
    dispatch(loadFilters("loading"));
    dispatch(loadApplied("loading"));

    navigate("/results");
    dispatch(loadQuerys({ q: productToSearch }));
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
      </div>

      <div className="navbar-central-section">
        <form onSubmit={handleSearch}>
          <span className="g-input-with-button">
            <input
              type="text"
              placeholder="Busca un producto"
              id="navbar-searchbar"
              onChange={(e) => setProductToSearch(e.target.value)}
              value={productToSearch}
            />
            {productToSearch && (
              <>
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </div>
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setProductToSearch("")}
                >
                  <CloseIcon />
                </div>
              </>
            )}
          </span>
        </form>

        <div className="navbar-central-subsection">
            
            <div className="navbar-central-options">
                <div className="chromatic-text" onClick={()=>navigate("products")}>                    
                    <p className="layer1">Provider Store</p>
                    <p className="layer2">Provider Store</p>
                    <p className="layer3">Provider Store</p>
                </div>
            </div>

            <div className="navbar-central-options">
                <div className="chromatic-text" onClick={()=>navigate("about")}>
                    <p className="layer1">About Us</p>
                    <p className="layer2">About Us</p>
                    <p className="layer3">About Us</p>
                </div>
            </div>

            <div className="navbar-central-options">                
                <div className="chromatic-text" onClick={()=>navigate("admin")}>
                    <p className="layer1">ADMIN</p>
                    <p className="layer2">ADMIN</p>
                    <p className="layer3">ADMIN</p>
                </div>
            </div>

             {/* <NavLink to={"products"}>
                <p className="provider-store">Provider Store</p>
            </NavLink>

            <NavLink to={"about"}>
                <p>About Us</p>
            </NavLink>

            <NavLink to={"/"}>
                <p>Contact</p>
            </NavLink>

            <NavLink to={"admin"}>
                <p>ADMIN</p>
            </NavLink> */}

        </div>
      </div>

      <div className="navbar-profile-container">
        <div className="navbar-profile-section">
          {!session ? (
            <NavLink to={"signin"}>
              <p>Sign in</p>
            </NavLink>
          ) : (
            <>
              <div className="navbar-profile-button"
                onMouseEnter={() => setProfileModal(true)}
                onMouseLeave={() => setProfileModal(false)}>
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
                <p className="navbar-username">{username || "Profile"}</p>

                <div className="navBar-modal-container">
                  <div className={`navbar-modal ${profileModal && "visible"}`}>
                    <div className="navbar-modal-menu-container"
                      onClick={() => setProfileModal(false)}>

                        <div className="profile-modal-option pointer" 
                            onClick={()=>navigate('/profile/details')}>
                            <div className="chromatic-text">
                                <p className="layer1">Mi perfil</p>
                                <p className="layer2">Mi perfil</p>
                                <p className="layer3">Mi perfil</p>
                            </div>
                        </div>

                        <div className="profile-modal-option pointer" 
                            onClick={()=>navigate('/profile/address')}>
                            <div className="chromatic-text">
                                <p className="layer1">Direcciones</p>
                                <p className="layer2">Direcciones</p>
                                <p className="layer3">Direcciones</p>
                            </div>
                        </div>

                        <div className="profile-modal-option pointer" 
                            onClick={()=>navigate('/profile/wishlist')}>
                            <div className="chromatic-text">
                                <p className="layer1">Favoritos</p>
                                <p className="layer2">Favoritos</p>
                                <p className="layer3">Favoritos</p>
                            </div>
                        </div>

                        <div className="profile-modal-option pointer" 
                            onClick={()=>navigate('/profile/orders')}>
                            <div className="chromatic-text">
                                <p className="layer1">Ordenes</p>
                                <p className="layer2">Ordenes</p>
                                <p className="layer3">Ordenes</p>
                            </div>
                        </div>

                        <div className="profile-modal-option pointer" 
                            onClick={()=>navigate('/profile/history')}>
                            <div className="chromatic-text">
                                <p className="layer1">Historial</p>
                                <p className="layer2">Historial</p>
                                <p className="layer3">Historial</p>
                            </div>
                        </div>
                        
                        <div className="profile-modal-option logout pointer"
                            onClick={()=>signOut()}>                            
                            <div className="chromatic-text">
                                <p className="layer1">Salir</p>
                                <p className="layer2">Salir</p>
                                <p className="layer3">Salir</p>
                            </div>
                        </div>

                    </div>
                  </div>
                </div>
              </div>

              <div
                className="navbar-wishlist-button"
                onMouseEnter={() => setWishModal(true)}
                onMouseLeave={() => setWishModal(false)}
              >
                <Fav className="wishlist-icon" />
                <div className="navBar-modal-container-w">
                  <div className={`navbar-modal-w ${wishModal && "visible"}`}>
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
