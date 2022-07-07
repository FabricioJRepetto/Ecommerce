import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";

const Users = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    axios("/user/getAll")
      .then(({ data }) => setUsersData(data))
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  }, []);

  return (
    <div>
      {React.Children.toArray(
        usersData?.map((user) => (
          <UserCard
            user={user}
            setAllUsersData={setUsersData}
            allUsersData={usersData}
          />
        ))
      )}
    </div>
  );
};

export default Users;
