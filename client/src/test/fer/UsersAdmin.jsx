import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import UserCard from "./UserCard";
import { useModal } from "../../hooks/useModal";
import { adminLoadUsers } from "../../Redux/reducer/sessionSlice";
import ModalAdminUsers from "./ModalAdminUsers";

const UsersAdmin = () => {
  const { allUsersData } = useSelector((state) => state.sessionReducer);
  const location = useLocation();
  const { id } = useParams();
  const [isOpenDeleteUser, openDeleteUser, closeDeleteUser, userToDelete] =
    useModal();
  const [isOpenPromoteUser, openPromoteUser, closePromoteUser, userToPromote] =
    useModal();
  const dispatch = useDispatch();

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
    }
  }, [location.pathname]);

  return (
    <div>
      <div>
        {React.Children.toArray(
          allUsersData?.map((user) => (
            <UserCard
              user={user}
              openDeleteUser={openDeleteUser}
              openPromoteUser={openPromoteUser}
            />
          ))
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
