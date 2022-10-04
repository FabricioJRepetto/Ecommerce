import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Ban } from "../../assets/svg/ban.svg";
import "./UserCardResume.css";

const UserCardResume = ({
  user,
  openBanUser,
  openUnbanUser,
  openPromoteUser,
}) => {
  const location = useLocation();

  const {
    name,
    email,
    role,
    emailVerified,
    avatar,
    _id,
    isGoogleUser,
    googleEmail,
  } = user;

  return (
    <div className="usercard-resume-container component-fadeIn">
      <div className="usercard-main-data-container">
        {avatar ? (
          <img
            src={avatar}
            className="admin-usercard-img"
            referrerPolicy="no-referrer"
            alt={`${name}`}
          />
        ) : (
          <div className="usercard-no-avatar-placeholder">NO AVATAR</div>
        )}

        <div className="usercard-text-data-container">
          <h3>{name}</h3>

          <div className="usercard-email-container">
            <p className="profile-email">
              {isGoogleUser ? googleEmail : email}
            </p>
            {emailVerified === true && (
              <div className="verified-gradient"></div>
            )}
          </div>

          {location.pathname !== "/admin/users" && (
            <h4>Cuenta de Google: {isGoogleUser ? "si" : "no"}</h4>
          )}

          <h4>Rol: {role}</h4>
        </div>
      </div>

      <div className="usercard-button-container">
        {location.pathname === "/admin/users" && (
          <span className="usercard-details-link-container">
            <Link to={`/admin/users/${_id}`}>Ver más detalles</Link>
          </span>
        )}

        {role === "client" && !isGoogleUser && (
          <button
            onClick={() => openPromoteUser({ _id, name })}
            className="g-white-button"
          >
            Promover a Administrador
          </button>
        )}
        {role === "client" && (
          <>
            <div className="pc-indicator-tooltip"> Suspender usuario</div>
            <button
              onClick={() => openBanUser({ _id, name })}
              className="g-white-button"
            >
              Suspender
            </button>
          </>
        )}
        {role === "banned" && (
          <button
            onClick={() => openUnbanUser({ _id, name })}
            className="g-white-button"
          >
            Activar cuenta
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCardResume;
