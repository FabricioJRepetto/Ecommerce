import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import { ReactComponent as Avatar } from "../../assets/svg/avatar.svg";
import { ReactComponent as Location } from "../../assets/svg/location.svg";
import { ReactComponent as Bag } from "../../assets/svg/bag.svg";
import { ReactComponent as Fav } from "../../assets/svg/fav.svg";
import { ReactComponent as Logout } from "../../assets/svg/logout.svg";
import { RepeatClockIcon } from "@chakra-ui/icons";
import ProfileDetails from "./ProfileDetails";
import Orders from "./Orders";
import Address from "./Address";
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
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(true)

  const { wishlist: wl_id } = useSelector((state) => state.cartReducer);
  const { session } = useSelector((state) => state.sessionReducer);

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setChange(!change)
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
        ];
        const p = await Promise.allSettled(requests);

        p[0].value ? setAddress(p[0].value.data.address) : setAddress([]);
        p[1].value ? setWishlist(p[1].value.data.products) : setWishlist([]);
        p[2].value ? setHistory(p[2].value.data.products) : setHistory([]);
        p[3].value ? setOrders(p[3].value.data) : setOrders([]);

        //? Notifica cuando se eliminaron productos que estaba en favoritos
        p[1].value.data.message &&
          notification(p[1].value.data.message, "", "warning");

        setLoading(false);
      })();
    }
    // eslint-disable-next-line
  }, [wl_id]);

  const sections = [
    'details',
    'address',
    'orders',
    'wishlist',
    'history',
    'password'
  ];
  const sectionsEsp = {
    details: 'PERFIL',
    address: 'DIRECCIONES',
    orders: 'COMPRAS',
    wishlist: 'FAVORITOS',
    history: 'HISTORIAL',
    password: 'CONTRASEÑA'
  };

  return (
    <div className="profile-container component-fadeIn">
      {/* <div
        className={`navbar-menu-mobile-background ${
          !showMenu ? "hide-menu-mobile-background" : ""
        }`}
        onClick={() => setShowMenu(false)}
      ></div> */}

      <div className={`profile-section-indicator ${change ? "spt-text" : "spt-textb"}`}>{sectionsEsp[render]}</div>

      <div
        className={`profile-menu-container profile-menu-container-placeholder profile-menu-container-placeholder-mobile${
          showMenu
            ? " profile-menu-container-show"
            : " profile-menu-container-hide"
        }`}
      ></div>
      <div
        className={`profile-menu-container profile-menu-container-fixed profile-menu-container-mobile${
          showMenu
            ? " profile-menu-container-show"
            : " profile-menu-container-hide"
        }`}
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

        {render === "orders" && 
            <Orders 
                orders={orders} 
                loading={loading}
            />
        }

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
