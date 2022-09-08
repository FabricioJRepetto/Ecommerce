import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReturnButton from "../common/ReturnButton";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { verifyToken } = useParams();
  const [response, setResponse] = useState(null);

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
      } catch (error) {
        setResponse(error.response.data.message); //! VOLVER A VER manejo de errores
      }
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="verify-email-container">
      <h1 className="">{response}</h1>
      <ReturnButton to={"/"} />
    </div>
  );
};

export default VerifyEmail;
