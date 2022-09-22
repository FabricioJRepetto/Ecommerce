import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import UserCard from "./UserCard";
import { useModal } from "../../hooks/useModal";
import {
  adminLoadUsers,
  adminFilterUsers,
} from "../../Redux/reducer/sessionSlice";
import ModalAdminUsers from "./ModalAdminUsers";

const UsersAdmin = () => {
  const { allUsersData, usersFilteredData } = useSelector(
    (state) => state.sessionReducer
  );
  const [nameSearch, setNameSearch] = useState("");
  const [error, setError] = useState(false)
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
    dispatch(adminLoadUsers(null));
    if (location.pathname === "/admin/users") {
      axios("/admin/user/getAll")
        .then(({ data }) => {
          dispatch(adminLoadUsers(data));
        })
        .catch((err) => console.error(err)); //! VOLVER A VER manejo de errores
    } else {
      axios(`/admin/user/${id}`)
        .then(({ data }) => {
          if (data.error) {
            setError(data.message)
          } else {
            dispatch(adminLoadUsers(data));
          }          
        })
        .catch((err) => console.error(err)); //! VOLVER A VER manejo de errores
    } // eslint-disable-next-line
  }, [location.pathname]);

  const handleNameSearch = (e) => {
    setNameSearch(e.target.value);
  };

  useEffect(() => {
    dispatch(adminFilterUsers(nameSearch));
    // eslint-disable-next-line
  }, [nameSearch]);

  return (
    <div className="component-fadeIn">
      <div>
        {location.pathname === "/admin/users" && (
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={nameSearch}
            onChange={handleNameSearch}
          />
        )}
        {usersToShow && usersToShow[0] === null && <h4>No hubieron coincidencias</h4>}
        
        {error && <h1>{error}hola</h1>}

        {usersToShow && usersToShow.length &&
            <div>{
                React.Children.toArray(
                usersToShow?.map((user) => (
                <UserCard
                    user={user}
                    openBanUser={openBanUser}
                    openUnbanUser={openUnbanUser}
                    openPromoteUser={openPromoteUser}
                />
                ))
            )
          }</div>}
      </div>
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
