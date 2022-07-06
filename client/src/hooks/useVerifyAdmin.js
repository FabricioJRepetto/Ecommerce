import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useVerifyAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios("/user/verifyAdmin").catch((_) => {
      navigate("/unauthorized");
    });
    // eslint-disable-next-line
  }, []);
};
