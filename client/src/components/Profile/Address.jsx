import React, { useState } from "react";
import axios from "axios";
import AddAddress from "./AddAddress";
import AddressCard from "../../test/fer/AddressCard";
import { useNotification } from "../../hooks/useNotification";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import { ReactComponent as PinBold } from "../../assets/svg/pin-bold.svg";
import "../../App.css";
import "./Address.css";
import LoaderBars from "../common/LoaderBars";

const Address = ({ loading, setLoading, address, setAddress }) => {
  const [addressToEditId, setAddressToEditId] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [notification] = useNotification();
  const [isOpenAddForm, openAddForm, closeAddForm, prop] = useModal();

  //? ADDRESS
  const deleteAddress = async (id) => {
    setLoading(true);
    const { data, statusText } = await axios.delete(`/address/${id}`);
    data.address ? setAddress(data.address) : setAddress([]);
    setLoading(false);
    notification(
      `${statusText === "OK" ? "Dirección eliminada" : "Algo salió mal"}`,
      "",
      `${statusText === "OK" ? "success" : "warning"}`
    );
  };

  // set default address
  const setDefault = async (id) => {
    const { data, statusText } = await axios.put(`/address/default/${id}`);
    setAddress(data.address);
    notification(
      `${
        statusText === "OK"
          ? "Dirección predeterminada establecida"
          : "Algo salió mal"
      }`,
      "",
      `${statusText === "OK" ? "success" : "warning"}`
    );
  };

  const getAddressToEdit = async (id) => {
    const { data } = await axios(`/address/`);
    const addressFound = data.address?.find((e) => e._id === id);
    setAddressToEdit(addressFound);
    openAddForm();
    setAddressToEditId(id);
  };

  return (
    <div className="profile-all-address-container">
      {!loading ? (
        <>
          <h1>Direcciones</h1>
          <div>
            {!address ||
              (address.length === 0 && (
                <p>Todavía no has agregado alguna dirección</p>
              ))}
            {React.Children.toArray(
              address?.map(
                (e) =>
                  e.isDefault && (
                    <div key={e.id} className="address-with-options-container">
                      <div className="address-with-pin">
                        <div
                          className="address-pin-gradient"
                          onClick={() => setDefault(e._id)}
                        ></div>
                        <AddressCard address={e} />
                      </div>

                      <div className="address-buttons-container">
                        <div
                          className="address-edit-gradient"
                          onClick={() => getAddressToEdit(e._id)}
                        ></div>

                        <div
                          className="address-trash-gradient"
                          onClick={() => deleteAddress(e._id)}
                        ></div>
                      </div>
                    </div>
                  )
              )
            )}
            {React.Children.toArray(
              address?.map(
                (e) =>
                  !e.isDefault && (
                    <div key={e.id} className="address-with-options-container">
                      <div className="address-with-pin">
                        <div
                          onClick={() => setDefault(e._id)}
                          className="address-pin-set-default"
                        >
                          {" "}
                          <PinBold />
                        </div>
                        <AddressCard address={e} />
                      </div>

                      <div className="address-buttons-container">
                        <div
                          className="address-edit-gradient"
                          onClick={() => getAddressToEdit(e._id)}
                        ></div>

                        <div
                          className="address-trash-gradient"
                          onClick={() => deleteAddress(e._id)}
                        ></div>
                      </div>
                    </div>
                  )
              )
            )}
            <button
              default={loading || true}
              onClick={() => openAddForm(true)}
              className="g-white-button"
            >
              Agregar dirección
            </button>
          </div>
        </>
      ) : (
        <LoaderBars />
      )}

      <Modal isOpen={isOpenAddForm} closeModal={closeAddForm}>
        {isOpenAddForm && (
          <AddAddress
            prop={prop}
            setAddressToEdit={setAddressToEdit}
            addressToEdit={addressToEdit}
            addressToEditId={addressToEditId}
            setAddress={setAddress}
            closeAddForm={closeAddForm}
          />
        )}
      </Modal>
    </div>
  );
};

export default Address;
