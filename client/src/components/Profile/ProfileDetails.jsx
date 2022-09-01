import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ReactComponent as Edit } from "../../assets/svg/edit.svg";
import { ReactComponent as Verified } from "../../assets/svg/verified.svg";
import { ReactComponent as Location } from "../../assets/svg/location.svg";
import { loadUserData } from "../../Redux/reducer/sessionSlice";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../hooks/useNotification";
import { avatarResizer } from "../../helpers/resizer";
import "./ProfileDetails.css";

const ProfileDetails = ({ address }) => {
  const [newAvatar, setNewAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [openInput, setOpenInput] = useState({
    username: false,
    full_name: false,
  });
  const {
    username,
    full_name,
    avatar,
    email,
    emailVerified,
    id,
    role,
    isGoogleUser,
  } = useSelector((state) => state.sessionReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenAvatar, openAvatar, closeAvatar] = useModal();
  const [notification] = useNotification();

  const onlyLettersRegex = /^([a-zñ .]){2,}$/gi; //! VOLVER A VER cambiar regex

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

      const propertyToEdit = Object.keys(updateData);

      if (propertyToEdit[0] === "username") {
        if (data.error) {
          setValueUsername("username", username);
          return notification(data.message, "", "warning");
        }

        dispatch(
          loadUserData({
            username: data.user.username,
          })
        );

        setOpenInput({
          ...openInput,
          username: false,
        });
      } else if (propertyToEdit.includes("firstname")) {
        if (data.error) {
          setValueFullname("firstname", `${full_name.first || ""}`);
          setValueFullname("lastname", `${full_name.last || ""}`);
          return notification(data.message, "", "warning");
        }

        dispatch(
          loadUserData({
            full_name: {
              first: data.user.firstname,
              last: data.user.lastname,
            },
          })
        );
        setOpenInput({
          ...openInput,
          full_name: false,
        });
      }

      notification(
        data.message,
        "",
        `${statusText === "OK" ? "success" : "warning"}`
      );
    } catch (error) {
      console.log(error); //! VOLVER A VER manejo de errores
      setOpenInput({
        username: false,
        full_name: false,
      });
    }
  };

  const handleOpenInputs = (input) => {
    setOpenInput({
      ...openInput,
      [input]: true,
    });
  };

  const handleVerifyEmail = async () => {
    setVerifyLoading(true);
    try {
      await axios.put("/user/sendVerifyEmail");
      notification("Revisa tu email para verificar tu cuenta", "", "");
    } catch (error) {
      setVerifyLoading(false);
      console.log(error);
      //! VOLVER A VER manejo de errores
    }
  };

  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: { errors: errorsUsername },
    setValue: setValueUsername,
    watch: watchUsername,
  } = useForm();
  const {
    register: registerFullname,
    handleSubmit: handleSubmitFullname,
    formState: { errors: errorsFullname },
    setValue: setValueFullname,
    watch: watchFullname,
  } = useForm();

  useEffect(() => {
    setValueUsername("username", username);
    setValueFullname("firstname", full_name.first);
    setValueFullname("lastname", full_name.last);
    // eslint-disable-next-line
  }, []);

  return (
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

      <div className="profile-detail-container">
        <h3>Usuario</h3>
        {!openInput.username ? (
          <span className="profile-detail-button-container">
            <button
              className="profile-detail-button-data"
              onClick={() => handleOpenInputs("username")}
            >
              {username}
            </button>
            <span
              className="profile-edit-svg-container"
              onClick={() => handleOpenInputs("username")}
            >
              <Edit />
            </span>
          </span>
        ) : (
          <form onSubmit={handleSubmitUsername(updateDetails)}>
            <>
              {!errorsUsername.username && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errorsUsername.username?.type === "required" && (
                <p className="g-error-input">Ingresa tu nombre de usuario</p>
              )}
              {errorsUsername.username?.type === "maxLength" && (
                <p className="g-error-input">
                  Se aceptan 15 caracteres como máximo
                </p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Nombre de usuario"
                autoComplete="off"
                {...registerUsername("username", {
                  required: true,
                  maxLength: 15,
                })}
              />
            </span>
          </form>
        )}
      </div>

      <div className="profile-detail-container">
        <h3>Nombre</h3>
        {!openInput.full_name ? (
          <span className="profile-detail-button-container profile-detail-name">
            <button
              className="profile-detail-button-data"
              onClick={() => handleOpenInputs("full_name")}
            >
              <span>{full_name.first}</span>
              <span> {full_name.last}</span>
            </button>
            <span
              className="profile-edit-svg-container"
              onClick={() => handleOpenInputs("full_name")}
            >
              <Edit />
            </span>
          </span>
        ) : (
          <form
            onSubmit={handleSubmitFullname(updateDetails)}
            className="profile-detail-name-container"
          >
            <span>
              <>
                {!errorsFullname.firstname && (
                  <p className="g-hidden-placeholder">hidden</p>
                )}
                {errorsFullname.firstname?.type === "pattern" && (
                  <p className="g-error-input">Ingresa un nombre válido</p>
                )}
                {errorsFullname.firstname?.type === "required" && (
                  <p className="g-error-input">Ingresa tu nombre</p>
                )}
                {errorsFullname.firstname?.type === "maxLength" && (
                  <p className="g-error-input">
                    Se aceptan 15 caracteres como máximo
                  </p>
                )}
              </>

              <span className="g-input-with-button">
                <input
                  type="text"
                  placeholder="Nombre"
                  autoComplete="off"
                  {...registerFullname("firstname", {
                    pattern: onlyLettersRegex,
                    required: true,
                    maxLength: 15,
                  })}
                />
              </span>
            </span>

            <span>
              <>
                {!errorsFullname.lastname && (
                  <p className="g-hidden-placeholder">hidden</p>
                )}
                {errorsFullname.lastname?.type === "pattern" && (
                  <p className="g-error-input">Ingresa un apellido válido</p>
                )}
                {errorsFullname.lastname?.type === "required" && (
                  <p className="g-error-input">Ingresa tu apellido</p>
                )}
                {errorsFullname.lastname?.type === "maxLength" && (
                  <p className="g-error-input">
                    Se aceptan 15 caracteres como máximo
                  </p>
                )}
              </>

              <span className="g-input-with-button">
                <input
                  type="text"
                  placeholder="Apellido"
                  autoComplete="off"
                  {...registerFullname("lastname", {
                    patter: onlyLettersRegex,
                    required: true,
                    maxLength: 15,
                  })}
                />
              </span>
            </span>

            <input
              type="submit"
              value="enviar"
              className="profile-hide-submit"
            />
          </form>
        )}
      </div>

      <div className="profile-detail-container">
        <h3>Email</h3>
        <span
          className={`profile-email-container ${
            emailVerified ? "" : "profile-email-not-verified-container"
          }`}
        >
          {emailVerified === true ? (
            <>
              <p className="profile-email">{email}</p>
              <Verified />
            </>
          ) : (
            <button
              onClick={handleVerifyEmail}
              className="g-white-button profile-email-not-verified-button"
              disabled={verifyLoading}
            >
              {email}
              <span className="profile-verify-email">
                {verifyLoading ? "Revisa tu email" : "Verifica tu email"}
              </span>
            </button>
          )}
        </span>
      </div>

      <div className="profile-detail-container profile-detail-container-address">
        <h3>Dirección</h3>
        {address.length
          ? address.map(
              (e) =>
                e.isDefault && (
                  <div
                    className="profile-address-container"
                    onClick={() => navigate("/profile/address")}
                  >
                    <p>{`${e.street_name} ${e.street_number}, ${e.city}`}</p>
                    <span className="profile-email-container">
                      <Location />
                    </span>
                  </div>
                )
            )
          : "Aún no tienes una dirección predeterminada"}
      </div>

      {!isGoogleUser && (
        <button
          onClick={() => navigate("/profile/password")}
          className="g-white-button"
        >
          Cambiar contraseña
        </button>
      )}

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
    </div>
  );
};

export default ProfileDetails;