import React, { useState } from "react";
import axios from "axios";
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
    axios({
      method: "POST",
      data: signupData,
      withCredentials: true,
      url: "http://localhost:4000/user/signup", //! VOLVER A VER cambiar
    }).then((res) => console.log(res.data));
  };
  const signin = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      data: signinData,
      withCredentials: true,
      url: "http://localhost:4000/user/signin", //! VOLVER A VER cambiar
    }).then((res) => {
      console.log(res.data);
    });
  };
  const getUser = () => {
    axios({
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
    axios({
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
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/product", //! VOLVER A VER cambiar
    }).then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  };

    const [product, setProduct] = useState({
        name: '',
        price: 0,
        description: '',
        attributes: ['rojo', 'azul'],
        main_features: ['rojo', 'azul']
     });
    const [productImg, setProductImg] = useState();
    
    const submitProduct = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('image', productImg);
        formData.append('data', JSON.stringify(product));
        
        const imgURL = await axios.post('http://localhost:4000/product/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(imgURL);
    };

  return (
    <div>
        <br/>
        <br/>
        <br/>
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
      <br/>
      <br/>
      <br/>
      <div>
        <button onClick={getProducts}>GET PRODUCTS</button>
        {products &&
          React.Children.toArray(
            products.map((prod) => (
              <>
                <h2>{prod.name}</h2>
                <img src={prod.imgURL} alt="producto" height={50}/>
                <h3>{`$${prod.price}`}</h3>
              </>
            ))
          )}
      </div>
      <>
        <br/>
        <br/>
        <br/>
        <h1>Product Form</h1>
        <form encType="multipart/form-data" onSubmit={submitProduct}>
            <div>
                <input type="text" name="name" placeholder="Title/Name" onChange={e => setProduct({...product, [e.target.name]: e.target.value})}/>
                <input type="number" name="price" placeholder="Price" onChange={e => setProduct({...product, [e.target.name]: e.target.value})}/>
            </div>
            <div>
                <input type="text" name="main_features" placeholder="Main features" onChange={e => setProduct({...product, [e.target.name]: [e.target.value]})}/>
                <input type="text" name="attributes" placeholder="Attributes" onChange={e => setProduct({...product, [e.target.name]: [e.target.value]})}/>
            </div>
            <div>
                <textarea name="description" placeholder="Description" onChange={e => setProduct({...product, [e.target.name]: e.target.value})}/>
            </div>
            <div>
                <input type="file" name="image" onChange={e => setProductImg(e.target.files[0])} />
            </div>
            <input type="submit" value='Send'/>
        </form>
      </>      
    </div>
  );
};

export default Authetication;
