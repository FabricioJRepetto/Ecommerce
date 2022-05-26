import React, { useState } from "react";
import Axios from "axios";
//import axios from "axios";

const initialSignup = {
  email: "",
  password: "",
};
const initialSignin = {
  email: "",
  password: "",
};

const Authetication = () => {
  const [signupData, setSignupData] = useState(initialSignup);
  const [signinData, setSigninData] = useState(initialSignin);
  const [userData, setUserData] = useState(null);

  const signup = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: signupData,
      withCredentials: true,
      url: "http://localhost:4000/user/signup", //! VOLVER A VER cambiar
    }).then((res) => console.log(res.data));
  };
  const signin = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: signinData,
      withCredentials: true,
      url: "http://localhost:4000/user/signin", //! VOLVER A VER cambiar
    }).then((res) => {
      console.log(res.data);
    });
  };
  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/user/profile", //! VOLVER A VER cambiar
    }).then((res) => {
      setUserData(res.data);
      console.log(res.data);
    });
  };

  const signOut = () => {
    /* axios
      .get("http://localhost:4000/user/signout") */
    Axios({
      method: "GET",
      url: "http://localhost:4000/user/signout",
    }).then((res) => console.log("sesion cerrada"));
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

  const [products, setProducts] = useState(null);
  const getProducts = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/product", //! VOLVER A VER cambiar
    }).then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  };

  return (
    <div>
      <>
        <form onSubmit={signup}>
          <h2>Sign Up</h2>
          <input
            type="text"
            name="email"
            placeholder="email"
            onChange={handleSignup}
            value={signupData.email}
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
            name="email"
            placeholder="email"
            onChange={handleSignin}
            value={signinData.email}
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
        {userData && <h1>{userData.email}</h1>}
        <button onClick={signOut}>Sign Out</button>
      </>
      <>
        <button onClick={getProducts}>GET PRODUCTS</button>
        {products &&
          React.Children.toArray(
            products.map((prod) => (
              <>
                <h2>{prod.name}</h2>
                <h3>{prod.price}</h3>
              </>
            ))
          )}
      </>
    </div>
  );
};

export default Authetication;
