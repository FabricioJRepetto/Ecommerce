import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import UserCardResume from "./UserCardResume";
import UserDetails from "./UserDetails";
import LoaderBars from "../common/LoaderBars";
import { useModal } from "../../hooks/useModal";
import {
  adminLoadUsers,
  adminLoadUserDetails,
  adminFilterUsers,
} from "../../Redux/reducer/sessionSlice";
import ModalAdminUsers from "./ModalAdminUsers";
import "./UsersAdmin.css";

const UsersAdmin = () => {
  const { allUsersData, usersFilteredData, adminUserDetails } = useSelector(
    (state) => state.sessionReducer
  );
  const [nameSearch, setNameSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const location = useLocation();
  const { id } = useParams();
  const [isOpenBanUser, openBanUser, closeBanUser, userToBan] = useModal();
  const [isOpenUnbanUser, openUnbanUser, closeUnbanUser, userToUnban] =
    useModal();
  const [isOpenPromoteUser, openPromoteUser, closePromoteUser, userToPromote] =
    useModal();
  const dispatch = useDispatch();

  let usersToShow =
    usersFilteredData.length > 0 ? usersFilteredData : allUsersData;

  useEffect(() => {
    setLoading(true);
    dispatch(adminLoadUsers(null));
    (async () => {
      try {
        if (
          location.pathname === "/admin/users" ||
          location.pathname === "/admin/users/"
        ) {
          const { data } = await axios("/admin/user/getAll");
          dispatch(adminLoadUsers(data));
        } else {
          const { data } = await axios(`/admin/user/${id}`);
          if (data.error) {
            setError(data.message);
          } else {
            dispatch(adminLoadUserDetails(data));
          }
        }
      } catch (error) {
        console.log(error); //! VOLVER A VER manejo de errores
      } finally {
        setLoading(false);
      }
    })(); // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      dispatch(adminLoadUsers([]));
    };
  }, []);

  const handleNameSearch = (e) => {
    setNameSearch(e.target.value);
  };

  useEffect(() => {
    dispatch(adminFilterUsers(nameSearch));
    // eslint-disable-next-line
  }, [nameSearch]);

  return (
    <div className="users-admin-outer-container component-fadeIn">
      {!loading ? (
        <div className="users-admin-middle-container">
          <h1>Usuarios</h1>

          {!error && location.pathname === "/admin/users" && (
            <div className="g-input-with-button">
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={nameSearch}
                onChange={handleNameSearch}
              />
            </div>
          )}
          {usersToShow && usersToShow[0] === null && (
            <h2>No hubieron coincidencias</h2>
          )}
          {error && <h2>{error}</h2>}

          {!error &&
            (location.pathname === "/admin/users" ||
              location.pathname === "/admin/users/") &&
            usersToShow &&
            usersToShow.length &&
            usersToShow[0] !== null && (
              <div className="admin-all-users-container">
                {React.Children.toArray(
                  usersToShow?.map((user) => (
                    <UserCardResume
                      user={user}
                      openBanUser={openBanUser}
                      openUnbanUser={openUnbanUser}
                      openPromoteUser={openPromoteUser}
                    />
                  ))
                )}
              </div>
            )}

          {!error &&
            location.pathname !== "/admin/users" &&
            location.pathname !== "/admin/users/" &&
            adminUserDetails &&
            Object.keys(adminUserDetails).length && (
              <UserDetails
                openBanUser={openBanUser}
                openUnbanUser={openUnbanUser}
                openPromoteUser={openPromoteUser}
              />
            )}
        </div>
      ) : (
        <LoaderBars />
      )}

      <ModalAdminUsers
        isOpenBanUser={isOpenBanUser}
        closeBanUser={closeBanUser}
        userToBan={userToBan}
        isOpenUnbanUser={isOpenUnbanUser}
        closeUnbanUser={closeUnbanUser}
        userToUnban={userToUnban}
        isOpenPromoteUser={isOpenPromoteUser}
        closePromoteUser={closePromoteUser}
        userToPromote={userToPromote}
      />
    </div>
  );
};

export default UsersAdmin;
