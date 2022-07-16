import React from "react";

const AddressCard = ({ address }) => {
  return (
    <div>
      <p>{`${address.street_name} ${address.street_number}, ${address.zip_code}, ${address.city}, ${address.state}.`}</p>
      {/* <button onClick={() => editAddress(address._id)}>edit</button>
      <button onClick={() => deleteAddress(address._id)}>delete</button>
      {address.isDefault ? (
        <p>⭐</p>
      ) : (
        <button onClick={() => setDefault(address._id)}>set as default</button>
      )} */}
      <p>- - -</p>
    </div>
  );
};

export default AddressCard;
