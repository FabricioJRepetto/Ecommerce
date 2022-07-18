import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import Modal from "../../components/common/Modal";
import {
  adminDeleteUser,
  adminPromoteUser,
} from "../../Redux/reducer/sessionSlice";

const ModalAdminUsers = ({
  isOpenDeleteUser,
  closeDeleteUser,
  userToDelete,
  isOpenPromoteUser,
  closePromoteUser,
  userToPromote,
}) => {
  const dispatch = useDispatch();

  const [notification] = useNotification();

  const handleDeleteUser = () => {
    deleteUser();
    closeDeleteUser();
  };

  const deleteUser = () => {
    axios
      .delete(`/admin/${userToDelete._id}`)
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
      .put(`/admin/promote/${userToPromote._id}`)
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

export default ModalAdminUsers;
