import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./Redux/store";
import axios from "axios";
import { BACK_URL } from "./constants";
import "./assets/fonts/HelveticaNeueLTProBd.otf";
import "./assets/fonts/HelveticaNeueLTProBdIt.otf";
import "./assets/fonts/HelveticaNeueLTProBdOu.otf";
import "./assets/fonts/HelveticaNeueLTProBlk.otf";
import "./assets/fonts/HelveticaNeueLTProBlkIt.otf";
import "./assets/fonts/HelveticaNeueLTProHv.otf";
import "./assets/fonts/HelveticaNeueLTProHvIt.otf";
import "./assets/fonts/HelveticaNeueLTProRoman.otf";

import "./index.css";

//? cosas de axios
axios.interceptors.request.use(function (config) {
    config.baseURL = BACK_URL;
    let token = localStorage.getItem("loggedTokenEcommerce");
    token &&
        (config.headers.Authorization =
            config.headers.Authorization || `Bearer ${token}`);
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
