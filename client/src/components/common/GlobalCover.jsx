import React, { useEffect, useState } from "react";
import "./GlobalCover.css";
import LoaderBars from "./LoaderBars";
import { loadingUserData } from "../../Redux/reducer/sessionSlice";
import { useDispatch } from "react-redux";

const GlobalCover = () => {
  const [aux, setAux] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setAux(true);
      dispatch(loadingUserData(false));
    }, 1000);
    // eslint-disable-next-line
  }, []);

  return <div className={`globalLoader ${aux && "globalLoaded"}`}></div>;
};

export default GlobalCover;
