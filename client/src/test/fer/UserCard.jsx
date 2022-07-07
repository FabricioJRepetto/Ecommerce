import axios from "axios";

const UserCard = ({ user, setAllUsersData, allUsersData }) => {
  const { name, email, role, emailVerified, avatar, _id } = user;

  const deleteUser = () => {
    //! VOLVER A VER agregar confirmacion
    axios
      .delete(`/user/${_id}`)
      .then((res) => {
        setAllUsersData(allUsersData.filter((user) => user._id !== _id));
        console.log("eliminadp");
      }) //! VOLVER A VER agregar notif
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>{name}</h2>
      <h4>Email: {email}</h4>
      <h4>Rol: {role}</h4>
      <h4>Verificado: {emailVerified ? "si" : "no"}</h4>
      <h4>{avatar}</h4>
      <button onClick={deleteUser}>Eliminar</button>
      <hr />
    </div>
  );
};

export default UserCard;
