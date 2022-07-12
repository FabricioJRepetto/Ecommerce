const UserCard = ({ user, openDeleteUser, openPromoteUser }) => {
  const { name, email, role, emailVerified, avatar, _id } = user;

  return (
    <div>
      <div>
        <h2>{name}</h2>
        <h4>Email: {email}</h4>
        <h4>Rol: {role}</h4>
        {role === "client" && (
          <button onClick={() => openPromoteUser({ _id, name })}>
            Promover a Administrador
          </button>
        )}
        <h4>Verificado: {emailVerified ? "si" : "no"}</h4>
        <h4>{avatar}</h4>
        {role === "client" && (
          <button onClick={() => openDeleteUser({ _id, name })}>
            Eliminar
          </button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default UserCard;
