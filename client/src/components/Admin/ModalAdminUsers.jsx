import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import Modal from "../../components/common/Modal";
import {
  adminBanUser,
  adminUnbanUser,
  adminPromoteUser,
} from "../../Redux/reducer/sessionSlice";

const ModalAdminUsers = ({
  isOpenBanUser,
  closeBanUser,
  userToBan,
  isOpenUnbanUser,
  closeUnbanUser,
  userToUnban,
  isOpenPromoteUser,
  closePromoteUser,
  userToPromote,
}) => {
  const dispatch = useDispatch();

  const notification = useNotification();

  const handleBanUser = () => {
    banUser();
    closeBanUser();
  };

  const banUser = () => {
    axios
      .delete(`/admin/user/${userToBan._id}`)
      .then((_) => {
        dispatch(adminBanUser(userToBan._id));
        notification("Cuenta suspendida exitosamente", "", "success");
      })
      .catch((err) => console.error(err));
  };

  const handleUnbanUser = () => {
    unbanUser();
    closeUnbanUser();
  };

  const unbanUser = () => {
    axios
      .put(`/admin/user/${userToUnban._id}`)
      .then((_) => {
        dispatch(adminUnbanUser(userToUnban._id));
        notification("Cuenta activada exitosamente", "", "success");
      })
      .catch((err) => console.error(err));
  };

  const handlePromoteUser = () => {
    promoteToAdmin();
    closePromoteUser();
  };

  const promoteToAdmin = () => {
    axios
      .put(`/admin/user/promote/${userToPromote._id}`)
      .then((_) => {
        dispatch(adminPromoteUser(userToPromote._id));
        notification(
          `Usuario ${userToPromote.name} promovido a administrador`,
          "",
          "success"
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <Modal isOpen={isOpenBanUser} closeModal={closeBanUser} type="warn">
        <p>{`¿Suspender al usuario ${userToBan ? userToBan.name : null}?`}</p>
        <button type="button" onClick={() => handleBanUser()}>
          Aceptar
        </button>
        <button type="button" onClick={closeBanUser}>
          Cancelar
        </button>
      </Modal>

      <Modal isOpen={isOpenUnbanUser} closeModal={closeUnbanUser} type="warn">
        <p>{`¿Volver a activar al usuario ${
          userToUnban ? userToUnban.name : null
        }?`}</p>
        <button type="button" onClick={() => handleUnbanUser()}>
          Aceptar
        </button>
        <button type="button" onClick={closeUnbanUser}>
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
