const UserCard = ({ user, openDeleteUser }) => {
  const { name, email, role, emailVerified, avatar, _id } = user;

  const handleRole = () => {};

  return (
    <div>
      <div>
        <h2>{name}</h2>
        <h4>Email: {email}</h4>
        <h4>Rol: {role}</h4>
        <h4>Verificado: {emailVerified ? "si" : "no"}</h4>
        <h4>{avatar}</h4>
        <button onClick={() => openDeleteUser({ _id, name })}>Eliminar</button>
        <button onClick={handleRole}>Cambiar Rol</button>
      </div>
      <hr />
    </div>
  );
};

export default UserCard;
