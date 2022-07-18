import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verifyToken } = useParams();
  const session = useSelector((state) => state.sessionReducer.session);

  useEffect(() => {
    axios
      .put("/admin/verifyEmail", null, {
        headers: {
          Authorization: `Bearer ${verifyToken}`,
        },
      })
      .then(({ data }) => {
        //! VOLVER A VER agregar mensaje y timeout antes de redirigir
        console.log("Email verified successfully");
        if (!session) navigate("/signin");
      })
      .catch((err) => {
        //! VOLVER A VER agregar mensaje y timeout antes de redirigir
        console.log(err);
        navigate("/home");
      });
  }, []);

  return <div>Verify Email</div>;
};

export default VerifyEmail;
