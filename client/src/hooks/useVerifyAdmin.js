import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useVerifyAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios("/user/verifyAdmin").catch((err) => {
      console.log("Sin autorización"); //! VOLVER A VER renderizar mensaje
      navigate("/");
    });
    // eslint-disable-next-line
  }, []);
};
