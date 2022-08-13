import React, { useEffect, useState } from "react";
import { loadingUserData } from "../../Redux/reducer/sessionSlice";
import { useDispatch } from "react-redux";
import LoaderBars from "./LoaderBars";
import "./GlobalCover.css";

const GlobalCover = () => {
  const [aux, setAux] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setAux(true);
      dispatch(loadingUserData(false));
    }, 100);
    // eslint-disable-next-line
  }, []);

  return <div className={`globalLoader ${aux && "globalLoaded"}`}></div>;
};

export default GlobalCover;
