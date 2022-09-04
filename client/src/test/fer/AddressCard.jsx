import { useLocation } from "react-router-dom";
import { ReactComponent as Pin } from "../../assets/svg/pin.svg";
import "./AddressCard.css";

const AddressCard = ({ address }) => {
  const location = useLocation();

  return (
    <div className="address-card-container">
      <p>{`${address.street_name} ${address.street_number}, ${address.zip_code}, ${address.city}, ${address.state}`}</p>
      {location.pathname === "/admin/users" && address.isDefault && <Pin />}
    </div>
  );
};

export default AddressCard;
