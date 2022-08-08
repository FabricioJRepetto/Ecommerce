import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verifyToken } = useParams();
  const [response, setResponse] = useState(null);
  const session = useSelector((state) => state.sessionReducer.session);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.put("/user/verifyEmail", null, {
          headers: {
            Authorization: `Bearer ${verifyToken}`,
          },
        });
        console.log("data", data);
        setResponse(data.message);
        setTimeout(() => {
          if (!session) {
            navigate("/signin");
          } else {
            navigate("/");
          }
        }, 4000);
      } catch (error) {
        setResponse(error.response.data.message); //! VOLVER A VER manejo de errores
        setTimeout(() => {
          navigate("/");
        }, 4000);
      }
    })();
    // eslint-disable-next-line
  }, []);

  return response && <h3 className="">{response}</h3>;
};

export default VerifyEmail;
