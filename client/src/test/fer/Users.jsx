import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/common/Modal";
import { useNotification } from "../../hooks/useNotification";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [isOpenDeleteUser, openDeleteUser, closeDeleteUser, userToDelete] =
    useModal();
  const [isOpenUserRole, openUserRole, closeUserRole, userToPromote] =
    useModal();
  const [notification] = useNotification();

  useEffect(() => {
    axios("/user/getAll")
      .then(({ data }) => setUsersData(data))
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
        setUsersData(usersData.filter((user) => user._id !== userToDelete._id));
        notification("Usuario eliminado exitosamente", "", "success");
      })
      .catch((err) => console.log(err));
  };

  const handleUserRole = () => {
    promoteToAdmin();
    closeUserRole();
  };

  const promoteToAdmin = () => {
    axios
      .put(`/user/promote/${userToPromote._id}`)
      .then((_) => {
        //setUsersData(usersData.find((user) => user._id === userToPromote._id));
        notification("Usuario promovido a administrador", "", "success");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div>
        {React.Children.toArray(
          usersData?.map((user) => (
            <UserCard
              user={user}
              setAllUsersData={setUsersData}
              allUsersData={usersData}
              openDeleteUser={openDeleteUser}
              openUserRole={openUserRole}
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
      <Modal isOpen={isOpenUserRole} closeModal={closeUserRole} type="warn">
        <p>{`¿Promover al usuario ${
          userToPromote ? userToPromote.name : null
        } a Administrador?`}</p>
        <p>Este cambio no puede ser revertido</p>
        <button type="button" onClick={() => handleUserRole()}>
          Aceptar
        </button>
        <button type="button" onClick={closeUserRole}>
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default Users;
