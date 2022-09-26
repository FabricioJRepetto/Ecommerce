import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
import WishlistModal from "../common/WishlistModal";
import { avatarResizer } from "../../helpers/resizer";
import { PowerGlitch } from "powerglitch";
import { useSignout } from "../../hooks/useSignout";
import ChromaticText from "../common/ChromaticText";
import BurgerButton from "../common/BurgerButton";
import "./NavBar.css";
import "../../App.css";

const NavBar = () => {
  const { session, username, avatar, role } = useSelector(
    (state) => state.sessionReducer
  );
  const cart = useSelector((state) => state.cartReducer.onCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [profileModal, setProfileModal] = useState(false);
  const [wishModal, setWishModal] = useState(false);
  const [productToSearch, setProductToSearch] = useState("");
  const [showSubsectionBar, setShowSubsectionBar] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const signOut = useSignout();
  const [widnowWidth, setWindowWidth] = useState(window.innerWidth);
  const [containerDisplay, setContainerDisplay] = useState(null);
  const menuMobileContainerMobile = useRef(null);

  useEffect(() => {
    const handleWindowSize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowSize);

    return () => {
      window.removeEventListener("resize", handleWindowSize);
      document.documentElement.style.overflowY = "auto";
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (menuMobileContainerMobile.current) {
      let menuContainerDisplay = window
        .getComputedStyle(menuMobileContainerMobile.current)
        .getPropertyValue("display");

      containerDisplay !== menuContainerDisplay &&
        setContainerDisplay(menuContainerDisplay);
    }
    // eslint-disable-next-line
  }, [menuMobileContainerMobile.current, widnowWidth]);

  useEffect(() => {
    console.log("containerDisplay", containerDisplay);
    if (containerDisplay === "flex" && showMenu) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflowY = "auto";
    }
  }, [containerDisplay, showMenu]);

  useEffect(() => {
    const glitchLogos = document.querySelectorAll(".little-glitch");
    glitchLogos.forEach((logo) =>
      PowerGlitch.glitch(logo, {
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
      })
    );

    /* const miniLogo = document.querySelectorAll(".mini-glitch");
    miniLogo.forEach((logo) =>
      PowerGlitch.glitch(logo, {
        imageUrl:
          "https://res.cloudinary.com/dsyjj0sch/image/upload/v1662061287/minilogo-01_ax91ep.png",
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
      })
    ); */

    const controlSubsectionBar = () => {
      window.scrollY > 80 && setShowSubsectionBar(true);
      window.scrollY < 80 && setShowSubsectionBar(false);
    };

    window.addEventListener("scroll", controlSubsectionBar);

    return () => {
      window.removeEventListener("scroll", controlSubsectionBar);
    };
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
    setShowSearchBar(false);
  };

  const logoClick = () => {
    dispatch(loadProductsOwn([]));
    dispatch(loadProductsFound([]));
    dispatch(loadFilters([]));
    document.querySelectorAll(".navbar-searchbar").value = "";
    navigate("/");
  };

  const handleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    !showSearchBar && searchInput.current.focus();
  };

  return (
    <>
      {/* <div className="navbar-dumb-hidden"></div> */}

      <div
        className={`glitch-mobile-container${
          showMenu ? " glitch-mobile-container-show-menu" : ""
        }`}
      >
        <div
          className={`little-glitch glitch-mobile${
            showMenu ? " little-glitch-show-menu" : ""
          }`}
          onClick={
            location.pathname === "/orders/post-sale" ||
            location.pathname === "/orders/post-sale/"
              ? () => navigate("/")
              : () => [logoClick(), setShowMenu(false)]
          }
        ></div>
        {/* <div
          className={`mini-glitch glitch-mobile${
            showMenu ? " mini-glitch-show-menu" : ""
          }`}
          onClick={
            location.pathname === "/orders/post-sale" ||
            location.pathname === "/orders/post-sale/"
              ? () => navigate("/")
              : () => [logoClick(), setShowMenu(false)]
          }
        ></div> */}
      </div>

      <div className="navbar">
        <div className="glitch-mobile-placeholder"></div>
        <div
          className={`little-glitch glitch-desktop${
            location.pathname === "/orders/post-sale" ||
            location.pathname === "/orders/post-sale/"
              ? " little-glitch-postsale"
              : ""
          }`}
          onClick={
            location.pathname === "/orders/post-sale" ||
            location.pathname === "/orders/post-sale/"
              ? () => navigate("/")
              : logoClick
          }
        ></div>

        {location.pathname !== "/orders/post-sale" &&
          location.pathname !== "/orders/post-sale/" && (
            <div className="navbar-sections">
              <div className="navbar-main-sections">
                <div className="navbar-central-section">
                  <form onSubmit={handleSearch}>
                    <span className="g-input-with-button">
                      <input
                        type="text"
                        placeholder="Busca un producto"
                        className="g-input-two-icons navbar-searchbar"
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
                </div>

                <div className="navbar-profile-section">
                  <div
                    className="navbar-search-mobile-button"
                    onClick={handleSearchBar}
                  >
                    <SearchIcon />
                  </div>
                  {!session ? (
                    <span className="navbar-signin-button">
                      <NavLink to={"signin"}>
                        <Avatar className="navbar-avatar-svg" />
                        <span className="navbar-signin-text navbar-hide-mobile">
                          <ChromaticText text="Iniciar sesión" />
                        </span>
                      </NavLink>
                    </span>
                  ) : (
                    <>
                      <div
                        className="navbar-profile-button navbar-hide-mobile"
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
                        <p className="navbar-username">
                          {username || "Profile"}
                        </p>

                        <div className="navbar-modal-container">
                          <div
                            className={`navbar-modal${
                              profileModal
                                ? " navbar-modal-visible"
                                : " navbar-modal-hide"
                            }`}
                          >
                            <div className="navbar-modal-menu-container">
                              <div
                                className="profile-modal-option"
                                onClick={() => setProfileModal(false)}
                              >
                                <ChromaticText
                                  text="Mi perfil"
                                  route="/profile/details"
                                />
                              </div>

                              <div
                                className="profile-modal-option"
                                onClick={() => setProfileModal(false)}
                              >
                                <ChromaticText
                                  text="Favoritos"
                                  route="/profile/wishlist"
                                />
                              </div>

                              <div
                                className="profile-modal-option"
                                onClick={() => setProfileModal(false)}
                              >
                                <ChromaticText text="Carrito" route="/cart" />
                              </div>

                              <div
                                className="profile-modal-option"
                                onClick={() => setProfileModal(false)}
                              >
                                <ChromaticText
                                  text="Historial"
                                  route="/profile/history"
                                />
                              </div>

                              <div
                                className="profile-modal-option"
                                onClick={() => setProfileModal(false)}
                              >
                                <ChromaticText
                                  text="Compras"
                                  route="/profile/orders"
                                />
                              </div>

                              <div
                                className="profile-modal-option"
                                onClick={() => setProfileModal(false)}
                              >
                                <ChromaticText
                                  text="Direcciones"
                                  route="/profile/address"
                                />
                              </div>

                              {(role === "admin" || role === "superadmin") && (
                                <div
                                  className="profile-modal-option"
                                  onClick={() => setProfileModal(false)}
                                >
                                  <ChromaticText
                                    text={"ADMIN"}
                                    route={"admin"}
                                  />
                                </div>
                              )}

                              <div className="logout">
                                <div
                                  className="profile-modal-option"
                                  onClick={() => [
                                    setProfileModal(false),
                                    signOut(),
                                  ]}
                                >
                                  <ChromaticText text="Salir" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="navbar-wishlist-button navbar-hide-mobile"
                        onMouseEnter={() => setWishModal(true)}
                        onMouseLeave={() => setWishModal(false)}
                        /* onClick={() => navigate("/profile/wishlist")} */
                      >
                        <Fav className="wishlist-icon" />
                        <div className="navbar-modal-container-w">
                          <div
                            className={`navbar-modal-w${
                              wishModal ? " visible" : " navbar-modal-hide"
                            }`}
                          >
                            {wishModal && (
                              <WishlistModal close={setWishModal} />
                            )}
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

              <div
                className={`navbar-central-subsection${
                  showSubsectionBar ? " hidden-box" : ""
                }${
                  !session
                    ? " navbar-subsection-signin-padding"
                    : " navbar-subsection-profile-padding"
                }`}
              >
                <div className="navbar-central-options">
                  <ChromaticText
                    text={"Provider Store"}
                    route={"provider"}
                    size={"1rem"}
                    movementAfter={"0 0 1rem 0"}
                  />
                </div>

                <div className="navbar-central-options">
                  <ChromaticText
                    text={"Provider Premium"}
                    route={"premium"}
                    size={"1rem"}
                    movementAfter={"0 0 1rem 0"}
                  />
                </div>

                <div className="navbar-central-options">
                  <ChromaticText
                    text={"Nosotros"}
                    route={"about"}
                    size={"1rem"}
                    movementAfter={"0 0 1rem 0"}
                  />
                </div>

                <div className="navbar-central-options">
                  <ChromaticText
                    text={"Preguntas Frecuentes"}
                    route={"faqs"}
                    size={"1rem"}
                    movementAfter={"0 0 1rem 0"}
                  />
                </div>
              </div>
            </div>
          )}

        <div
          className={`navbar-search-bar-mobile ${
            showSearchBar
              ? "navbar-search-bar-mobile-show"
              : "navbar-search-bar-mobile-hide"
          }`}
        >
          <form onSubmit={handleSearch}>
            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Busca un producto"
                className="g-input-two-icons navbar-searchbar"
                ref={searchInput}
                onChange={(e) => setProductToSearch(e.target.value)}
                onBlur={() => setShowSearchBar(false)}
                value={productToSearch}
              />
              <>
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setShowSearchBar(false)}
                >
                  <CloseIcon />
                </div>
              </>
            </span>
          </form>
        </div>
      </div>

      <div className="navbar-menu-mobile-button">
        <BurgerButton setShowMenu={setShowMenu} showMenu={showMenu} />
      </div>

      <div
        className={`navbar-menu-mobile-background${
          !showMenu ? " hide-menu-mobile-background" : ""
        }`}
        onClick={() => setShowMenu(false)}
      ></div>
      <div
        className={`navbar-menu-mobile${showMenu ? " show-menu-mobile" : ""}`}
        ref={menuMobileContainerMobile}
      >
        <ul>
          {!session && (
            <li onClick={() => setShowMenu(false)}>
              <ChromaticText
                text={"Iniciar sesión"}
                route={"signin"}
                size={"1.1rem"}
              />
            </li>
          )}
          <li onClick={() => setShowMenu(false)}>
            <ChromaticText
              text={"Provider Store"}
              route={"provider"}
              size={"1.1rem"}
            />
          </li>
          <li onClick={() => setShowMenu(false)}>
            <ChromaticText
              text={"Provider Premium"}
              route={"premium"}
              size={"1.1rem"}
            />
          </li>
          {session && (
            <>
              <div></div>
              <li onClick={() => setShowMenu(false)}>
                <ChromaticText
                  text="Mi perfil"
                  route="/profile/details"
                  size={"1.1rem"}
                />
              </li>
              <li onClick={() => setShowMenu(false)}>
                <ChromaticText
                  text="Favoritos"
                  route="/profile/wishlist"
                  size={"1.1rem"}
                />
              </li>
              <li
                onClick={() => setShowMenu(false)}
                className="navbar-mobile-option-hide"
              >
                <ChromaticText text="Carrito" route="/cart" size={"1.1rem"} />
              </li>
              <li
                onClick={() => setShowMenu(false)}
                className="navbar-mobile-option-hide"
              >
                <ChromaticText
                  text="Historial"
                  route="/profile/history"
                  size={"1.1rem"}
                />
              </li>
              <li
                onClick={() => setShowMenu(false)}
                className="navbar-mobile-option-hide"
              >
                <ChromaticText
                  text="Compras"
                  route="/profile/orders"
                  size={"1.1rem"}
                />
              </li>
              <li
                onClick={() => setShowMenu(false)}
                className="navbar-mobile-option-hide"
              >
                <ChromaticText
                  text="Direcciones"
                  route="/profile/address"
                  size={"1.1rem"}
                />
              </li>
            </>
          )}
          {session && (role === "admin" || role === "superadmin") && (
            <li onClick={() => setShowMenu(false)}>
              <ChromaticText text={"ADMIN"} route={"admin"} size={"1.1rem"} />
            </li>
          )}
          <div className="navbar-mobile-option-hide"></div>
          <li
            onClick={() => setShowMenu(false)}
            className="navbar-mobile-option-hide"
          >
            <ChromaticText
              text={"¿Quiénes somos?"}
              route={"about"}
              size={"1.1rem"}
            />
          </li>
          <div></div>
          <li onClick={() => [signOut(), setShowMenu(false)]}>
            <ChromaticText text="Salir" size={"1.1rem"} />
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavBar;
