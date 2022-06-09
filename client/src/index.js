import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { BACK_URL } from "./constants";

//? defaults para axios
axios.defaults.baseURL = BACK_URL;
let token = localStorage.getItem('loggedTokenEcommerce');
if (token) {
    if (/google/.test(token)) {
        token = token.slice(6)
    } 
    axios.defaults.headers.common['Authorization'] = `token ${token}`
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);