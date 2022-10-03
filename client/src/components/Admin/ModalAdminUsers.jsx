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
import "./ModalAdminUsers.css";

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
    <div className="modal-admin-users-outer-container component-fadeIn">
      <Modal isOpen={isOpenBanUser} closeModal={closeBanUser} type="warn">
        <div className="modal-admin-users">
          <p>{`¿Suspender al usuario ${userToBan ? userToBan.name : null}?`}</p>
          <div className="modal-admin-users-button-container">
            <button
              type="button"
              onClick={() => handleBanUser()}
              className="g-white-button"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closeBanUser}
              className="g-white-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isOpenUnbanUser} closeModal={closeUnbanUser} type="warn">
        <div className="modal-admin-users">
          <p>{`¿Volver a activar al usuario ${
            userToUnban ? userToUnban.name : null
          }?`}</p>
          <div className="modal-admin-users-button-container">
            <button
              type="button"
              onClick={() => handleUnbanUser()}
              className="g-white-button"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closeUnbanUser}
              className="g-white-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOpenPromoteUser}
        closeModal={closePromoteUser}
        type="warn"
      >
        <div className="modal-admin-users">
          <p>{`¿Promover al usuario ${
            userToPromote ? userToPromote.name : null
          } a Administrador?`}</p>
          <p>Este cambio no puede ser revertido</p>{" "}
          <div className="modal-admin-users-button-container">
            <button
              type="button"
              onClick={() => handlePromoteUser()}
              className="g-white-button"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closePromoteUser}
              className="g-white-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalAdminUsers;
