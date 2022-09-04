import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderDetails.css";

const OrderDetails = ({ order }) => {
  const navigate = useNavigate();
  useEffect(() => {
    !order && navigate("");
    // eslint-disable-next-line
  }, []);

  return <div>OrderDetails</div>;
};

export default OrderDetails;
