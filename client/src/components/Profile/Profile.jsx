import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import { ReactComponent as Avatar } from "../../assets/svg/avatar.svg";
import { ReactComponent as Location } from "../../assets/svg/location.svg";
import { ReactComponent as Bag } from "../../assets/svg/bag.svg";
import { ReactComponent as Tag } from "../../assets/svg/tag.svg";
import { ReactComponent as MoneyBag } from "../../assets/svg/money-bag.svg";
import { ReactComponent as Fav } from "../../assets/svg/fav.svg";
import { ReactComponent as Logout } from "../../assets/svg/logout.svg";
import { RepeatClockIcon } from "@chakra-ui/icons";
import ProfileDetails from "./ProfileDetails";
import Orders from "./Orders";
import Address from "./Address";
import Publications from "./Publications";
import UserSales from "./UserSales";
import Wishlist from "./Wishlist";
import History from "./History";
import UpdatePassword from "../Session/UpdatePassword";
import { useSignout } from "../../hooks/useSignout";
import ChromaticText from "../common/ChromaticText";
import BurgerButton from "../common/BurgerButton";
import NotFound from "../common/NotFound";

import "../../App.css";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const { section } = useParams();
  const signOut = useSignout();

  const [render, setRender] = useState(section);
  const [address, setAddress] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(true);

  const { wishlist: wl_id } = useSelector((state) => state.cartReducer);
  const { session, role } = useSelector((state) => state.sessionReducer);

  const [widnowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const [containerDisplay, setContainerDisplay] = useState(null);
  const profileMenuContainerMobile = useRef(null);

  useEffect(() => {
    setChange(!change);
    setRender(section || "details");
    // eslint-disable-next-line
  }, [section]);

  useEffect(() => {
    if (!session) {
      navigate("/signin");
    } else {
      (async () => {
        const requests = [
          axios(`/address/`),
          axios(`/wishlist/`),
          axios(`/history/`),
          axios(`/order/userall`),
          //axios(`/notifications/`),
          axios(`/user/products`),
        ];
        const p = await Promise.allSettled(requests);

        p[0].value ? setAddress(p[0].value.data.address) : setAddress([]);
        p[1].value ? setWishlist(p[1].value.data.products) : setWishlist([]);
        p[2].value ? setHistory(p[2].value.data.products) : setHistory([]);
        p[3].value ? setOrders(p[3].value.data) : setOrders([]);

        p[4].value ? setPublications(p[4].value.data) : setPublications([]);

        //? Notifica cuando se eliminaron productos que estaba en favoritos
        p[1].value.data.message &&
          notification(p[1].value.data.message, "", "warning");

        setLoading(false);
      })();
    }
    // eslint-disable-next-line
  }, [wl_id]);

  const sections = [
    "details",
    "address",
    "orders",
    "sales",
    "products",
    "wishlist",
    "history",
    "password",
  ];
  const sectionsEsp = {
    details: "PERFIL",
    address: "DIRECCIONES",
    orders: "COMPRAS",
    sales: "VENTAS",
    products: "PUBLICACIONES",
    wishlist: "FAVORITOS",
    history: "HISTORIAL",
    password: "CONTRASEÑA",
  };

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
    if (profileMenuContainerMobile.current) {
      let menuContainerDisplay = window
        .getComputedStyle(profileMenuContainerMobile.current)
        .getPropertyValue("display");

      containerDisplay !== menuContainerDisplay &&
        setContainerDisplay(menuContainerDisplay);
    }
    // eslint-disable-next-line
  }, [profileMenuContainerMobile.current, widnowWidth]);

  useEffect(() => {
    if (containerDisplay === "flex" && showMenu) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflowY = "auto";
    }
  }, [containerDisplay, showMenu]);

  return (
    <div className="profile-container component-fadeIn">
      <div
        className={`navbar-menu-mobile-background ${
          !showMenu
            ? "hide-menu-mobile-background"
            : "profile-menu-mobile-background"
        }`}
        onClick={() => setShowMenu(false)}
      ></div>

      <div
        className={`profile-section-indicator ${
          change ? "spt-text" : "spt-textb"
        }`}
      >
        {sectionsEsp[render]}
      </div>

      <div className="profile-menu-container profile-menu-container-placeholder profile-menu-container-placeholder-mobile profile-menu-container-hide"></div>

      <div
        className={`profile-menu-container profile-menu-container-fixed profile-menu-container-mobile${
          showMenu
            ? " profile-menu-container-show"
            : " profile-menu-container-hide"
        }`}
        ref={profileMenuContainerMobile}
      >
        <ul>
          <div style={{ height: "1rem" }}></div>
          <div
            className={`profile-burger-container${
              !showMenu ? " profile-burger-container-hide" : ""
            }`}
            onClick={() => setShowMenu(!showMenu)}
          >
            <BurgerButton setShowMenu={setShowMenu} showMenu={showMenu} />
          </div>
          <>
            <li
              onClick={() => {
                navigate("/profile/details");
                setShowMenu(false);
              }}
            >
              <span className="profile-svg-container">
                <Avatar />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Detalles"} size={"1.1rem"} />
              </span>
            </li>
            <li
              onClick={() => {
                navigate("/create");
                setShowMenu(false);
              }}
            >
              <span className="profile-svg-container profile-svg-rescale">
                <Bag />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Publicar"} size={"1.1rem"} />
              </span>
            </li>
            <li
              onClick={() => {
                navigate("/profile/address");
                setShowMenu(false);
              }}
            >
              <span className="profile-svg-container">
                <Location />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Direcciones"} size={"1.1rem"} />
              </span>
            </li>
            <li
              onClick={() => {
                navigate("/profile/orders");
                setShowMenu(false);
              }}
            >
              <span className="profile-svg-container profile-svg-rescale">
                <Bag />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Compras"} size={"1.1rem"} />
              </span>
            </li>
            {role === "client" && (
              <li
                onClick={() => {
                  navigate("/profile/products");
                  setShowMenu(false);
                }}
              >
                <span className="profile-svg-container profile-svg-rescale">
                  <Tag
                    style={{
                      transform: "scale(1.1)",
                    }}
                  />
                </span>
                <span className="profile-chromatic-container">
                  <ChromaticText text={"Publicaciones"} size={"1.1rem"} />
                </span>
              </li>
            )}
            {role === "client" && (
              <li
                onClick={() => {
                  navigate("/profile/sales");
                  setShowMenu(false);
                }}
              >
                <span className="profile-svg-container profile-svg-rescale">
                  <MoneyBag
                    style={{
                      width: "32px",
                      height: "32px",
                      transform: "scale(.95)",
                      left: "0.6rem",
                      top: "0.5rem",
                    }}
                  />
                </span>
                <span className="profile-chromatic-container">
                  <ChromaticText text={"Ventas"} size={"1.1rem"} />
                </span>
              </li>
            )}
            <li
              onClick={() => {
                navigate("/profile/wishlist");
                setShowMenu(false);
              }}
            >
              <span className="profile-svg-container">
                <Fav />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Favoritos"} size={"1.1rem"} />
              </span>
            </li>
            <li
              onClick={() => {
                navigate("/profile/history");
                setShowMenu(false);
              }}
            >
              <RepeatClockIcon />
              <span className="profile-chromatic-container">
                <ChromaticText text={"Historial"} size={"1.1rem"} />
              </span>
            </li>
            <li
              className="profile-mobile-option-hide"
              onClick={() => {
                navigate("/");
                signOut();
              }}
            >
              <span className="profile-svg-container profile-svg-rescale">
                <Logout />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Salir"} size={"1.1rem"} />
              </span>
            </li>
          </>
        </ul>
      </div>

      <div className="profile-menu-container profile-menu-container-placeholder-desktop"></div>
      <div className="profile-menu-container profile-menu-container-fixed profile-menu-container-desktop">
        <ul>
          <div className="profile-burger-container">
            <BurgerButton setShowMenu={setShowMenu} showMenu={showMenu} />
          </div>
          <>
            <li onClick={() => navigate("/profile/details")}>
              <span className="profile-svg-container">
                <Avatar />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Detalles"} size={"1.1rem"} />
              </span>
            </li>
            <li onClick={() => navigate("/profile/address")}>
              <span className="profile-svg-container">
                <Location />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Direcciones"} size={"1.1rem"} />
              </span>
            </li>
            <li onClick={() => navigate("/profile/orders")}>
              <span className="profile-svg-container profile-svg-rescale">
                <Bag />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Compras"} size={"1.1rem"} />
              </span>
            </li>
            {role === "client" && (
              <li onClick={() => navigate("/profile/products")}>
                <span className="profile-svg-container profile-svg-rescale">
                  <Tag
                    style={{
                      transform: "scale(1.1)",
                    }}
                  />
                </span>
                <span className="profile-chromatic-container">
                  <ChromaticText text={"Publicaciones"} size={"1.1rem"} />
                </span>
              </li>
            )}
            {role === "client" && (
              <li onClick={() => navigate("/profile/sales")}>
                <span className="profile-svg-container profile-svg-rescale">
                  <MoneyBag
                    style={{
                      width: "32px",
                      height: "32px",
                      transform: "scale(.95)",
                      left: "0.6rem",
                      top: "0.5rem",
                    }}
                  />
                </span>
                <span className="profile-chromatic-container">
                  <ChromaticText text={"Ventas"} size={"1.1rem"} />
                </span>
              </li>
            )}
            <li onClick={() => navigate("/profile/wishlist")}>
              <span className="profile-svg-container">
                <Fav />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Favoritos"} size={"1.1rem"} />
              </span>
            </li>
            <li onClick={() => navigate("/profile/history")}>
              <RepeatClockIcon />
              <span className="profile-chromatic-container">
                <ChromaticText text={"Historial"} size={"1.1rem"} />
              </span>
            </li>
            <li
              onClick={() => {
                navigate("/");
                signOut();
              }}
            >
              <span className="profile-svg-container profile-svg-rescale">
                <Logout />
              </span>
              <span className="profile-chromatic-container">
                <ChromaticText text={"Salir"} size={"1.1rem"} />
              </span>
            </li>
          </>
        </ul>
      </div>

      <div className="profile-option-selected-container">
        {render === "details" && (
          <ProfileDetails address={address} loading={loading} />
        )}

        {render === "orders" && <Orders orders={orders} loading={loading} />}

        {role === "client" && render === "sales" && (
          <UserSales sales={publications.sales} loading={loading} />
        )}

        {role === "client" && render === "products" && (
          <Publications loading={loading} publications={publications} />
        )}

        {render === "address" && (
          <Address
            loading={loading}
            setLoading={setLoading}
            setAddress={setAddress}
            address={address}
          />
        )}

        {render === "wishlist" && (
          <Wishlist loading={loading} wishlist={wishlist} wl_id={wl_id} />
        )}

        {render === "history" && (
          <History loading={loading} history={history} wl_id={wl_id} />
        )}

        {render === "password" && <UpdatePassword />}

        {!sections.includes(section) && <NotFound />}
      </div>
    </div>
  );
};

export default Profile;
