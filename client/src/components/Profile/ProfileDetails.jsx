import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ReactComponent as Edit } from "../../assets/svg/edit.svg";
import { ReactComponent as Location } from "../../assets/svg/location.svg";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import { loadUserData } from "../../Redux/reducer/sessionSlice";
import { useNotification } from "../../hooks/useNotification";
import { avatarResizer } from "../../helpers/resizer";
import "../../App.css";
import "./ProfileDetails.css";

const ProfileDetails = ({ address, loading }) => {
  const [newAvatar, setNewAvatar] = useState();
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResponse, setVerifyResponse] = useState(false);
  const [openInput, setOpenInput] = useState({
    username: false,
    full_name: false,
  });
  const [focusFlag, setFocusFlag] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingUsername, setLoadingUsername] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [avatarFlag, setAvatarFlag] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
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
  const notification = useNotification();

  const { REACT_APP_UPLOAD_PRESET, REACT_APP_CLOUDINARY_URL } = process.env;

  const onlyLettersRegex = /^([a-zñ .]){2,}$/gi; //! VOLVER A VER cambiar regex

  const handleAvatar = (e) => {
    if (emailVerified === false)
      return notification(
        "Verifica tu email para poder editar tu perfil",
        "",
        "warning"
      );

    if (e.target.files.length === 0) return;
    setLoadingAvatar(true);
    const fileListArrayImg = Array.from(e.target.files);

    if (fileListArrayImg[0].size > 2405442) {
      setAvatarError("La imágen debe pesar 2mb como máximo");
      setTimeout(() => setAvatarError(null), 7000);
      return setLoadingAvatar(false);
    }
    setNewAvatar(fileListArrayImg[0]);
    setAvatarFlag(true);
  };

  useEffect(() => {
    if (avatarFlag) {
      uploadAvatar();
      setAvatarFlag(false);
    }
    // eslint-disable-next-line
  }, [avatarFlag]);

  const uploadAvatar = async () => {
    setAvatarError(null);

    try {
      let formData = new FormData();
      formData.append("file", newAvatar);
      formData.append("upload_preset", REACT_APP_UPLOAD_PRESET);

      const { data: newAvatarData } = await axios.post(
        REACT_APP_CLOUDINARY_URL,
        formData
      );

      const { data, statusText } = await axios.post("/user/avatar", {
        url: newAvatarData.secure_url,
      });

      notification(
        data.message,
        "",
        `${statusText === "OK" ? "success" : "warning"}`
      );

      dispatch(loadUserData({ avatar: data.avatar }));
    } catch (error) {
      console.log("error", error);
      //! VOLVER A VER manejo de errores
    } finally {
      setLoadingAvatar(false);
    }
  };

  const updateDetails = async (updateData) => {
    const propertyToEdit = Object.keys(updateData);

    if (propertyToEdit[0] === "username") setLoadingUsername(true);
    if (propertyToEdit.includes("firstname")) setLoadingName(true);

    try {
      const { data, statusText } = await axios.put(
        "/user/editProfile",
        updateData
      );

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
      console.error(error); //! VOLVER A VER manejo de errores
      setOpenInput({
        username: false,
        full_name: false,
      });
    } finally {
      if (propertyToEdit[0] === "username") setLoadingUsername(false);
      if (propertyToEdit.includes("firstname")) setLoadingName(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerifyLoading(true);
    try {
      await axios.put("/user/sendVerifyEmail");
      notification("Revisa tu email para verificar tu cuenta", "", "");
      setVerifyResponse(true);
    } catch (error) {
      setVerifyLoading(false);
      console.error(error);
      //! VOLVER A VER manejo de errores
    }
  };

  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: { errors: errorsUsername },
    setValue: setValueUsername,
    setFocus: setFocusUsername,
  } = useForm();
  const {
    register: registerFullname,
    handleSubmit: handleSubmitFullname,
    formState: { errors: errorsFullname },
    setValue: setValueFullname,
    setFocus: setFocusFullname,
  } = useForm();

  const handleOpenInputs = (input) => {
    if (emailVerified === false)
      return notification(
        "Verifica tu email para poder editar tus detalles",
        "",
        "warning"
      );
    setOpenInput({
      ...openInput,
      [input]: true,
    });

    setFocusFlag(input);
  };
  useEffect(() => {
    if (focusFlag) {
      if (focusFlag === "username") setFocusUsername("username");
      if (focusFlag === "full_name") setFocusFullname("firstname");
      setFocusFlag(false);
    }
    // eslint-disable-next-line
  }, [focusFlag]);

  useEffect(() => {
    setValueUsername("username", username);
    setValueFullname("firstname", full_name.first);
    setValueFullname("lastname", full_name.last);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="profile-details-container component-fadeIn">
      <h1>Detalles</h1>

      <span className="profile-avatar-container">
        {!loadingAvatar && (
          <label className="profile-edit-svg-container" htmlFor="filesButton">
            {emailVerified === true ? (
              <span className="profile-svg-for-verified-email">
                <div className="edit-gradient"></div>
                <Edit />
              </span>
            ) : (
              <Edit />
            )}
          </label>
        )}
        <label className="profile-avatar-container-label" htmlFor="filesButton">
          {loadingAvatar ? (
            <Spinner className="cho-svg" />
          ) : (
            <>
              <img
                src={
                  avatar
                    ? avatarResizer(avatar)
                    : require("../../assets/avatardefault.png")
                }
                referrerPolicy="no-referrer"
                alt="avatar"
              />
              {emailVerified === true && (
                <span className="profile-avatar-background">
                  Cambiar avatar
                </span>
              )}
            </>
          )}
        </label>
      </span>

      {avatarError === null ? (
        <p className="g-hidden-placeholder">hidden</p>
      ) : (
        <p className="g-error-input">{avatarError}</p>
      )}

      {emailVerified === false ? (
        <input
          id="filesButton"
          className="profile-avatar-input"
          onClick={() =>
            notification(
              "Verifica tu email para poder cambiar tu avatar",
              "",
              "warning"
            )
          }
        ></input>
      ) : (
        <input
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleAvatar}
          id="filesButton"
          className="profile-avatar-input"
        />
      )}

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
              {emailVerified === true ? (
                <span className="profile-svg-for-verified-email">
                  <div className="edit-gradient"></div>
                  <Edit />
                </span>
              ) : (
                <Edit />
              )}
            </span>
          </span>
        ) : (
          <form onSubmit={handleSubmitUsername(updateDetails)}>
            <>
              {!errorsUsername.username && !loadingUsername && (
                <span className="g-info-input">
                  Presiona Enter para guardar cambios
                </span>
              )}
              {loadingUsername && (
                <p className="g-hidden-placeholder">
                  Presiona Enter para guardar cambios
                </p>
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
                disabled={loadingUsername}
                {...registerUsername("username", {
                  required: true,
                  maxLength: 15,
                })}
              />
            </span>
          </form>
        )}
      </div>

      <div className="profile-detail-container profile-detail-name-box-container">
        <h3>Nombre</h3>
        {!openInput.full_name ? (
          <span className="profile-detail-button-container profile-detail-name">
            <button
              className="profile-detail-button-data"
              onClick={() => handleOpenInputs("full_name")}
            >
              {!full_name.first && !full_name.last ? (
                <span>--- ----</span>
              ) : (
                <>
                  <span>{full_name.first}</span>
                  <span> {full_name.last}</span>
                </>
              )}
            </button>
            <span
              className="profile-edit-svg-container"
              onClick={() => handleOpenInputs("full_name")}
            >
              {emailVerified === true ? (
                <span className="profile-svg-for-verified-email">
                  <div className="edit-gradient"></div>
                  <Edit />
                </span>
              ) : (
                <Edit />
              )}
            </span>
          </span>
        ) : (
          <form
            onSubmit={handleSubmitFullname(updateDetails)}
            className="profile-detail-name-container"
          >
            {!errorsFullname.lastname &&
              !errorsFullname.firstname &&
              !loadingName && (
                <span className="g-info-input">
                  Presiona Enter para guardar cambios
                </span>
              )}
            <div className="profile-details-name-inputs-container">
              <span>
                <>
                  {errorsFullname.lastname && !errorsFullname.firstname && (
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
                    disabled={loadingName}
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
                  {errorsFullname.firstname && !errorsFullname.lastname && (
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
                    disabled={loadingName}
                    {...registerFullname("lastname", {
                      pattern: onlyLettersRegex,
                      required: true,
                      maxLength: 15,
                    })}
                  />
                </span>
              </span>
            </div>

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
          className={`profile-email-container${
            emailVerified ? "" : " profile-email-not-verified-container"
          }`}
        >
          {emailVerified === true ? (
            <>
              <p className="profile-email">{email}</p>
              <div className="verified-gradient"></div>
            </>
          ) : (
            <button
              onClick={handleVerifyEmail}
              className="g-white-button profile-email-not-verified-button"
              disabled={verifyLoading}
            >
              {email}
              <span className="provider-text">
                {verifyResponse ? "Revisa tu email" : "Verifica tu email"}
              </span>
            </button>
          )}
        </span>
      </div>

      <div className="profile-detail-container profile-detail-container-address">
        <h3>Dirección</h3>
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : address && address.length ? (
          address.map(
            (e) =>
              e.isDefault && (
                <div
                  className="profile-address-container component-fadeIn"
                  onClick={() => navigate("/profile/address")}
                  key={e.street_number}
                >
                  <p>{`${e.street_name} ${e.street_number}, ${e.city}`}</p>
                  <span className="profile-email-container">
                    <div className="location-gradient"></div>
                    <Location />
                  </span>
                </div>
              )
          )
        ) : (
          <p className="profile-not-default-address-message">
            Aún no tienes una dirección predeterminada
          </p>
        )}
      </div>

      {!isGoogleUser && (
        <div className="profile-detail-container">
          <h3>Seguridad</h3>
          <button
            onClick={() => navigate("/profile/password")}
            className="g-white-button profile-password-button"
          >
            Cambiar contraseña
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
