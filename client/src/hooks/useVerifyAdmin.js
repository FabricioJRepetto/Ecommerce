import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useVerifyAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios("/admin/verifyAdmin").catch((_) => {
      //! VOLVER A VER agregar manejo de errores
      navigate("/unauthorized");
    });
    // eslint-disable-next-line
  }, []);
};
