import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UserCard from "./UserCard";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/common/Modal";
import { useNotification } from "../../hooks/useNotification";
import {
  adminLoadUsers,
  adminDeleteUser,
  adminPromoteUser,
} from "../../Redux/reducer/sessionSlice";

const Users = () => {
  const { allUsersData } = useSelector((state) => state.sessionReducer);
  const [isOpenDeleteUser, openDeleteUser, closeDeleteUser, userToDelete] =
    useModal();
  const [isOpenPromoteUser, openPromoteUser, closePromoteUser, userToPromote] =
    useModal();
  const dispatch = useDispatch();
  const [notification] = useNotification();

  useEffect(() => {
    axios("/user/getAll")
      .then(({ data }) => {
        dispatch(adminLoadUsers(data));
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  }, []);

  const handleDeleteUser = () => {
    deleteUser();
    closeDeleteUser();
  };

  const deleteUser = () => {
    axios
      .delete(`/user/${userToDelete._id}`)
      .then((_) => {
        dispatch(adminDeleteUser(userToDelete._id));
        notification("Usuario eliminado exitosamente", "", "success");
      })
      .catch((err) => console.log(err));
  };

  const handlePromoteUser = () => {
    promoteToAdmin();
    closePromoteUser();
  };

  const promoteToAdmin = () => {
    axios
      .put(`/user/promote/${userToPromote._id}`)
      .then((_) => {
        dispatch(adminPromoteUser(userToPromote._id));
        notification(
          `Usuario ${userToPromote.name} promovido a administrador`,
          "",
          "success"
        );
      })
      .catch((err) => console.log(err));
  };

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
      <Modal isOpen={isOpenDeleteUser} closeModal={closeDeleteUser} type="warn">
        <p>{`¿Eliminar al usuario ${
          userToDelete ? userToDelete.name : null
        }?`}</p>
        <button type="button" onClick={() => handleDeleteUser()}>
          Aceptar
        </button>
        <button type="button" onClick={closeDeleteUser}>
          Cancelar
        </button>
      </Modal>
      <Modal
        isOpen={isOpenPromoteUser}
        closeModal={closePromoteUser}
        type="warn"
      >
        <p>{`¿Promover al usuario ${
          userToPromote ? userToPromote.name : null
        } a Administrador?`}</p>
        <p>Este cambio no puede ser revertido</p>
        <button type="button" onClick={() => handlePromoteUser()}>
          Aceptar
        </button>
        <button type="button" onClick={closePromoteUser}>
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default Users;
