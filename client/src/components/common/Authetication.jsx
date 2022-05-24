import { useState } from "react";
import Axios from "axios";

const initialSignup = {
  username: "",
  password: "",
};
const initialSignin = {
  username: "",
  password: "",
};

const Authetication = () => {
  const [signupData, setSignupData] = useState(initialSignup);
  const [signinData, setSigninData] = useState(initialSignin);
  const [userData, setUserData] = useState(null);

  const signup = (e) => {
    e.preventDefault();
    Axios({
      //! VOLVER A VER ¿cambiar axios por Axios?
      method: "POST",
      data: signupData,
      withCredentials: true,
      url: "http://localhost:4000/signup", //! VOLVER A VER cambiar
    }).then((res) => console.log(res));
  };
  const signin = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: signinData,
      withCredentials: true,
      url: "http://localhost:4000/signin", //! VOLVER A VER cambiar
    }).then((res) => console.log(res));
  };
  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/user", //! VOLVER A VER cambiar
    }).then((res) => {
      setUserData(res.data);
      console.log(res.data);
    });
  };

  const handleSignup = ({ target }) => {
    setSignupData({
      ...signupData,
      [target.name]: target.value,
    });
  };
  const handleSignin = ({ target }) => {
    setSigninData({
      ...signinData,
      [target.name]: target.value,
    });
  };

  return (
    <div>
      <form onSubmit={signup}>
        <h2>Sign Up</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleSignup}
          value={signupData.username}
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleSignup}
          value={signupData.password}
        />
        <input type="submit" value="Sign Up" />
      </form>
      <form onSubmit={signin}>
        <h2>Sign In</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleSignin}
          value={signinData.username}
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleSignin}
          value={signinData.password}
        />
        <input type="submit" value="Sign In" />
      </form>
      <button onClick={getUser}>Get User</button>
      {userData && <h1>{userData.username}</h1>}
    </div>
  );
};

export default Authetication;
