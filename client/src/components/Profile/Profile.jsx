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
import "../../App.css";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [notification] = useNotification();
  const { section } = useParams();
  const signOut = useSignout();

  const [render, setRender] = useState(section);
  const [address, setAddress] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { wishlist: wl_id } = useSelector((state) => state.cartReducer);
  const { session } = useSelector((state) => state.sessionReducer);

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setRender(section || "details");
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
        ];
        const p = await Promise.allSettled(requests);

        p[0].value ? setAddress(p[0].value.data.address) : setAddress([]);
        p[1].value ? setWishlist(p[1].value.data.products) : setWishlist([]);
        p[2].value ? setHistory(p[2].value.data.products) : setHistory([]);

        p[0].value.data.message &&
          notification(p[0].value.data.message, "", "warning");
        p[1].value.data.message &&
          notification(p[1].value.data.message, "", "warning");
        p[2].value.data.message &&
          notification(p[2].value.data.message, "", "warning");
        setLoading(false);
      })();
    }
    // eslint-disable-next-line
  }, [wl_id]);

  return (
    <div className="profile-container">
      {/* <div
        className={`navbar-menu-mobile-background ${
          !showMenu ? "hide-menu-mobile-background" : ""
        }`}
        onClick={() => setShowMenu(false)}
      ></div> */}
      <div
        className={`profile-menu-container profile-menu-container-placeholder profile-menu-container-placeholder-mobile ${
          showMenu
            ? "profile-menu-container-show"
            : "profile-menu-container-hide"
        }`}
      ></div>
      <div
        className={`profile-menu-container profile-menu-container-fixed profile-menu-container-mobile ${
          showMenu
            ? "profile-menu-container-show"
            : "profile-menu-container-hide"
        }`}
      >
        <ul>
          <div
            className={`profile-burger-container ${
              !showMenu ? "profile-burger-container-hide" : ""
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
                <ChromaticText text={"Órdenes"} size={"1.1rem"} />
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
                <ChromaticText text={"Órdenes"} size={"1.1rem"} />
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
        {render === "details" && <ProfileDetails address={address} />}

        {render === "orders" && <Orders />}

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
      </div>
    </div>
  );
};

export default Profile;
