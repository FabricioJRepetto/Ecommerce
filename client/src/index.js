import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { BACK_URL } from "./constants";

//? cosas de axios
axios.interceptors.request.use(function (config) {
    config.baseURL = BACK_URL;
    const { token } = store.getState().sessionReducer;
    config.headers.Authorization =  `token ${token}`;
    return config;
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);