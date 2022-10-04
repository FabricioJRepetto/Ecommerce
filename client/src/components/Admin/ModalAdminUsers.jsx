import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const banUser = async () => {
    setLoading(true);
    try {
      await axios.delete(`/admin/user/${userToBan._id}`);
      dispatch(adminBanUser(userToBan._id));
      notification("Cuenta suspendida exitosamente", "", "success");
    } catch (error) {
      console.log(error); //! VOLVER A VER manejo de errores
    } finally {
      setLoading(false);
      closeBanUser();
    }
  };

  const unbanUser = async () => {
    setLoading(true);
    try {
      await axios.put(`/admin/user/${userToUnban._id}`);
      dispatch(adminUnbanUser(userToUnban._id));
      notification("Cuenta activada exitosamente", "", "success");
    } catch (error) {
      console.log(error); //! VOLVER A VER manejo de errores
    } finally {
      setLoading(false);
      closeUnbanUser();
    }
  };

  const promoteToAdmin = async () => {
    setLoading(true);
    try {
      await axios.put(`/admin/user/promote/${userToPromote._id}`);
      dispatch(adminPromoteUser(userToPromote._id));
      notification(
        `Usuario ${userToPromote.name} promovido a administrador`,
        "",
        "success"
      );
    } catch (error) {
      console.log(error); //! VOLVER A VER manejo de errores
    } finally {
      setLoading(false);
      closePromoteUser();
    }
  };

  return (
    <div className="modal-admin-users-outer-container component-fadeIn">
      <Modal isOpen={isOpenBanUser} closeModal={closeBanUser} type="warn">
        <div className="modal-admin-users">
          <p>{`¿Suspender al usuario ${userToBan ? userToBan.name : null}?`}</p>
          <div className="modal-admin-users-button-container">
            <button
              type="button"
              onClick={banUser}
              className="g-white-button"
              disabled={loading}
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closeBanUser}
              className="g-white-button"
              disabled={loading}
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
              onClick={unbanUser}
              className="g-white-button"
              disabled={loading}
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closeUnbanUser}
              className="g-white-button"
              disabled={loading}
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
              onClick={promoteToAdmin}
              className="g-white-button"
              disabled={loading}
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={closePromoteUser}
              className="g-white-button"
              disabled={loading}
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
