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
import WishlistModal from "../common/WishlistModal";
import { avatarResizer } from "../../helpers/resizer";
import { PowerGlitch } from "powerglitch";
import "./NavBar.css";
import "../../App.css";
import { useSignout } from "../../hooks/useSignout";
import ChromaticText from "../common/ChromaticText";

const NavBar = () => {
  const { session, username, avatar, role } = useSelector(
    (state) => state.sessionReducer
  );
  const cart = useSelector((state) => state.cartReducer.onCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileModal, setProfileModal] = useState(false);
  const [wishModal, setWishModal] = useState(false);
  const [productToSearch, setProductToSearch] = useState("");
  const [showSubsectionBar, setShowSubsectionBar] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
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

  const controlSubsectionBar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY < lastScroll) {
        setShowSubsectionBar(false);
      } else {
        setShowSubsectionBar(true);
      }
      setLastScroll(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlSubsectionBar);

      return () => {
        window.removeEventListener("scroll", controlSubsectionBar);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScroll]);

  return (
    <>
      <div className="navbar-dumb-hidden"></div>
      <div className="navbar">
        <div
          className={`glitch ${showSubsectionBar ? "little-glitch" : ""}`}
          onClick={logoClick}
        ></div>

        <div className="navbar-sections">
          <div className="navbar-main-sections">
            <div className="navbar-central-section">
              <form onSubmit={handleSearch}>
                <span className="g-input-with-button">
                  <input
                    type="text"
                    placeholder="Busca un producto"
                    className="g-input-two-icons"
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
            </div>

            <div className="navbar-profile-section">
              {!session ? (
                <span className="navbar-signin-button">
                  <NavLink to={"signin"}>
                    <Avatar className="navbar-avatar-svg" />
                    <span className="navbar-signin-text">
                      <ChromaticText text="Iniciar sesión" />
                    </span>
                  </NavLink>
                </span>
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
                    <p className="navbar-username">{username || "Profile"}</p>

                    <div className="navbar-modal-container">
                      <div
                        className={`navbar-modal ${
                          profileModal ? "visible" : ""
                        }`}
                      >
                        <div
                          className="navbar-modal-menu-container"
                          onClick={() => setProfileModal(false)}
                        >
                          <div className="profile-modal-option">
                            <ChromaticText
                              text="Mi perfil"
                              route="/profile/details"
                            />
                          </div>

                          <div className="profile-modal-option">
                            <ChromaticText
                              text="Direcciones"
                              route="/profile/address"
                            />
                          </div>

                          <div className="profile-modal-option">
                            <ChromaticText
                              text="Favoritos"
                              route="/profile/wishlist"
                            />
                          </div>

                          <div className="profile-modal-option">
                            <ChromaticText
                              text="Ordenes"
                              route="/profile/orders"
                            />
                          </div>

                          <div className="profile-modal-option">
                            <ChromaticText
                              text="Historial"
                              route="/profile/history"
                            />
                          </div>

                          <div
                            className="profile-modal-option logout"
                            onClick={() => signOut()}
                          >
                            <ChromaticText text="Salir" />
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
                    <div className="navbar-modal-container-w">
                      <div
                        className={`navbar-modal-w ${
                          wishModal ? "visible" : ""
                        }`}
                      >
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
          <div
            className={`navbar-central-subsection ${
              showSubsectionBar ? "hidden-box" : ""
            } ${
              !session
                ? "navbar-subsection-signin-padding"
                : "navbar-subsection-profile-padding"
            }`}
          >
            <div className="navbar-central-options">
              <ChromaticText
                text={"Provider Store"}
                route={"products"}
                size={"1rem"}
                movementAfter={"1rem 0 0 0"}
              />
            </div>

            <div className="navbar-central-options">
              <ChromaticText
                text={"Provider Deluxe"}
                route={"products"}
                size={"1rem"}
                movementAfter={"1rem 0 0 0"}
              />
            </div>

            <div className="navbar-central-options">
              <ChromaticText
                text={"FAQs"}
                route={"about"}
                size={"1rem"}
                movementAfter={"1rem 0 0 0"}
              />
            </div>

            <div className="navbar-central-options">
              <ChromaticText
                text={"About Us"}
                route={"about"}
                size={"1rem"}
                movementAfter={"1rem 0 0 0"}
              />
            </div>

            {role === "client" ? (
              <></>
            ) : (
              <div className="navbar-central-options">
                <ChromaticText
                  text={"ADMIN"}
                  route={"admin"}
                  size={"1rem"}
                  movementAfter={"1rem 0 0 0"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
