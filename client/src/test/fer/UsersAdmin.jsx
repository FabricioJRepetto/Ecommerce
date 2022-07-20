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
  const location = useLocation();
  const { id } = useParams();
  const [isOpenDeleteUser, openDeleteUser, closeDeleteUser, userToDelete] =
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
        .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
    } else {
      axios(`/admin/user/${id}`)
        .then(({ data }) => {
          dispatch(adminLoadUsers(data));
        })
        .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
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
    <div>
      <div>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={nameSearch}
          onChange={handleNameSearch}
        />
        {usersToShow && usersToShow[0] === null ? (
          <h4>No hubieron coincidencias</h4>
        ) : (
          React.Children.toArray(
            usersToShow?.map((user) => (
              <UserCard
                user={user}
                openDeleteUser={openDeleteUser}
                openPromoteUser={openPromoteUser}
              />
            ))
          )
        )}
      </div>
      <ModalAdminUsers
        isOpenDeleteUser={isOpenDeleteUser}
        closeDeleteUser={closeDeleteUser}
        userToDelete={userToDelete}
        isOpenPromoteUser={isOpenPromoteUser}
        closePromoteUser={closePromoteUser}
        userToPromote={userToPromote}
      />
    </div>
  );
};

export default UsersAdmin;
