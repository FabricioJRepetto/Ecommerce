import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import { avatarResizer } from "../../helpers/resizer";
import { avoidEnterSubmit } from "../../helpers/AvoidEnterSubmit";
import { useNotification } from "../../hooks/useNotification";
import { loadUserData } from "../../Redux/reducer/sessionSlice";
import { ReactComponent as Avatar } from "../../assets/svg/avatar.svg";
import { ReactComponent as Location } from "../../assets/svg/location.svg";
import { ReactComponent as Bag } from "../../assets/svg/bag.svg";
import { ReactComponent as Fav } from "../../assets/svg/fav.svg";
import { ReactComponent as Logout } from "../../assets/svg/logout.svg";
import { CloseIcon, RepeatClockIcon } from "@chakra-ui/icons";
import Orders from "./Orders";
import Address from "./Address";
import Wishlist from "./Wishlist";
import History from "./History";
import UpdatePassword from "../Session/UpdatePassword";
import { useSignout } from "../../hooks/useSignout";
import "../../App.css";
import "./Profile.css";
import ChromaticText from "../common/ChromaticText";
import BurgerButton from "../common/BurgerButton";

const Profile = () => {
  const navigate = useNavigate();
  const [notification] = useNotification();
  const [isOpenAvatar, openAvatar, closeAvatar] = useModal();
  const [isOpenDetails, openDetails, closeDetails] = useModal();
  const { section } = useParams();
  const dispatch = useDispatch();
  const signOut = useSignout();

  const [render, setRender] = useState(section);
  const [address, setAddress] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { wishlist: wl_id } = useSelector((state) => state.cartReducer);
  const {
    session,
    username,
    full_name,
    avatar,
    email,
    id,
    role,
    isGoogleUser,
  } = useSelector((state) => state.sessionReducer);

  const [newAvatar, setNewAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [showMenu, setShowMenu] = useState(false);

  const {
    register: registerEditDetails,
    handleSubmit: handleSubmitEditDetails,
    formState: { errors: errorsEditDetails },
    setValue: setValueEditDetails,
    watch: watchEditDetails,
  } = useForm();

  useEffect(() => {
    setValueEditDetails("username", username);
    setValueEditDetails("name", full_name.first);
    setValueEditDetails("lastname", full_name.last);
    // eslint-disable-next-line
  }, []);

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

  const avatarHandler = (e) => {
    setNewAvatar(e.target.files);
    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
  };

  const uploadAvatar = async (e) => {
    e.target.disabled = true;
    let formData = new FormData();

    const fileListArrayImg = Array.from(newAvatar);

    fileListArrayImg.forEach((pic) => {
      formData.append("images", pic);
    });

    const { data, statusText } = await axios.post("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    notification(
      data.message,
      "",
      `${statusText === "OK" ? "success" : "warning"}`
    );
    // dispatch(loadAvatar(data.avatar));
    dispatch(loadUserData({ avatar: data.avatar }));
    closeAvatar();
  };

  const updateDetails = async (updateData) => {
    console.log("updateData", updateData);
    try {
      const { data, statusText } = await axios.put(
        "/user/editProfile",
        updateData
      );
      if (data.error) {
        setValueEditDetails("username", username);
        setValueEditDetails("name", "");
        setValueEditDetails("lastname", "");
        return notification(data.message, "", "warning");
      }

      console.log("data", data);

      dispatch(
        loadUserData({
          full_name: { first: data.user.firstName, last: data.user.lastName },
          username: data.user.username,
        })
      );
      //dispatch(loadUsername(data.user.username));
      notification(
        data.message,
        "",
        `${statusText === "OK" ? "success" : "warning"}`
      );
    } catch (error) {
      console.log(error); //! VOLVER A VER manejo de errores
    } finally {
      closeDetails();
    }
  };

  const onlyLettersRegex = /^([a-zñ .]){2,}$/gi;

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
            className="profile-burger-container"
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
        {render === "details" && (
          <div className="profile-details-container">
            <h1>Detalles</h1>
            <div className="profile-avatar-container">
              <img
                src={
                  avatar
                    ? avatarResizer(avatar)
                    : require("../../assets/avatardefault.png")
                }
                referrerPolicy="no-referrer"
                alt="avatar"
                onClick={openAvatar}
                style={{ cursor: "pointer" }}
              />
            </div>
            <h2>{username}</h2>
            <p>{email}</p>
            <p>{`${full_name.first || ""} ${full_name.last || ""}`}</p>
            <br />
            <i>{id}</i>
            <p>{role}</p>
            <br />
            <button onClick={openDetails} className="g-white-button">
              Editar detalles
            </button>
            <br />
            {!isGoogleUser && (
              <button
                onClick={() => navigate("/profile/password")}
                className="g-white-button"
              >
                Cambiar contraseña
              </button>
            )}
            <br />
            <div>
              {address
                ? React.Children.toArray(
                    address.map(
                      (e) =>
                        e.isDefault && (
                          <div key={e.id}>
                            <p>{`${e.street_name} ${e.street_number}, ${e.zip_code}, ${e.city}, ${e.state}.`}</p>
                            {e.isDefault && <p>⭐</p>}
                          </div>
                        )
                    )
                  )
                : "Aún no tienes una dirección predeterminada seleccionada"}
            </div>
          </div>
        )}

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

      <Modal isOpen={isOpenAvatar} closeModal={closeAvatar}>
        {isOpenAvatar && (
          <div>
            <h1>editar avatar</h1>
            <div className="avatar-preview">
              <img
                src={
                  avatarPreview
                    ? avatarPreview
                    : avatar
                    ? avatarResizer(avatar)
                    : require("../../assets/avatardefault.png")
                }
                alt="avatar-preview"
              />
            </div>
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg, image/gif"
              onChange={avatarHandler}
              id="filesButton"
            />
            <button onClick={uploadAvatar}>actualizar avatar</button>
          </div>
        )}
      </Modal>

      <Modal isOpen={isOpenDetails} closeModal={closeDetails}>
        {isOpenDetails && (
          <form
            onSubmit={handleSubmitEditDetails(updateDetails)}
            onKeyDown={avoidEnterSubmit}
          >
            <>
              {!errorsEditDetails.username && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsEditDetails.username?.type === "required" && (
                <p className="g-error-input">Ingresa tu nombre de usuario</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Nombre de usuario"
                autoComplete="off"
                {...registerEditDetails("username", {
                  required: true,
                })} /* //! VOLVER A VER agregar length, agregar validación en back */
              />
              {watchEditDetails("username") === "" ||
              watchEditDetails("username") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValueEditDetails("username", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errorsEditDetails.name && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsEditDetails.name?.type === "pattern" && (
                <p className="g-error-input">Ingresa un nombre válido</p>
              )}
              {errorsEditDetails.name?.type === "required" && (
                <p className="g-error-input">Ingresa tu nombre</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Nombre"
                autoComplete="off"
                {...registerEditDetails("name", {
                  pattern: onlyLettersRegex,
                  required: true,
                })} /* //! VOLVER A VER agregar length, agregar validación en back */
              />
              {watchEditDetails("name") === "" ||
              watchEditDetails("name") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValueEditDetails("name", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errorsEditDetails.lastname && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsEditDetails.lastname?.type === "pattern" && (
                <p className="g-error-input">Ingresa un apellido válido</p>
              )}
              {errorsEditDetails.lastname?.type === "required" && (
                <p className="g-error-input">Ingresa tu apellido</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Apellido"
                autoComplete="off"
                {...registerEditDetails("lastname", {
                  patter: onlyLettersRegex,
                  required: true,
                })} /* //! VOLVER A VER agregar validación en back */
              />
              {watchEditDetails("lastname") === "" ||
              watchEditDetails("lastname") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValueEditDetails("lastname", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <button className="g-white-button">Actualizar</button>
            <button onClick={closeDetails} className="g-white-button">
              Cancelar
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Profile;
