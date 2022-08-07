import React, { useEffect, useState } from "react";
import "./GlobalCover.css";
import LoaderBars from "./LoaderBars";
import { loadingUserData } from "../../Redux/reducer/sessionSlice";
import { useDispatch } from "react-redux";

const GlobalCover = () => {
  const [aux, setAux] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("renderiza global");
    setTimeout(() => {
      setAux(true);
      dispatch(loadingUserData(false));
    }, 100);
  }, []);

  return <div className={`globalLoader ${aux && "globalLoaded"}`}></div>;
};

export default GlobalCover;
