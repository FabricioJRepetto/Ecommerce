import React, { useState } from "react";
import axios from "axios";
import AddAddress from "./AddAddress";
import AddressCard from "./AddressCard";
import { useNotification } from "../../hooks/useNotification";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import { ReactComponent as Pin } from "../../assets/svg/pin.svg";
import { ReactComponent as PinBold } from "../../assets/svg/pin-bold.svg";
import { ReactComponent as Edit } from "../../assets/svg/edit.svg";
import { ReactComponent as Delete } from "../../assets/svg/trash.svg";
import "../../App.css";
import "./Address.css";
import LoaderBars from "../common/LoaderBars";

const Address = ({ loading, setLoading, address, setAddress }) => {
  const [addressToEditId, setAddressToEditId] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const notification = useNotification();
  const [isOpenAddForm, openAddForm, closeAddForm, prop] = useModal();

  //? ADDRESS
  const deleteAddress = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/address/${id}`);
      data.address ? setAddress(data.address) : setAddress([]);

      notification("Dirección eliminada", "", "success");
    } catch (error) {
      notification("Algo salió mal", "", "warning");
    } finally {
      setLoading(false);
    }
  };

  // set default address
  const setDefault = async (id) => {
    try {
      const { data } = await axios.put(`/address/default/${id}`);
      setAddress(data.address);

      notification("Dirección predeterminada establecida", "", "success");
    } catch (error) {
      notification("Algo salió mal", "", "warning");
    }
  };

  const getAddressToEdit = async (id) => {
    try {
      const { data } = await axios(`/address/`);
      const addressFound = data.address?.find((e) => e._id === id);
      setAddressToEdit(addressFound);
      openAddForm();
      setAddressToEditId(id);
    } catch (error) {
      console.log(error); //! VOLVER A VER manejo de errores
    }
  };

  return (
    <div className="profile-all-address-container component-fadeIn">
      {!loading ? (
        <>
          <h1>Direcciones</h1>
          <div>
            {(!address || address.length === 0) && (
              <p>Aún no has agregado ninguna dirección</p>
            )}
            {React.Children.toArray(
              address?.map(
                (e) =>
                  e.isDefault && (
                    <div key={e.id} className="address-with-options-container">
                      <div className="address-with-pin address-with-pin-default">
                        <div className="address-pin-gradient"></div>
                        <AddressCard address={e} />
                      </div>

                      <div className="address-buttons-container">
                        <span
                          className="address-edit-button-container"
                          onClick={() => getAddressToEdit(e._id)}
                        >
                          <Edit />
                          <div className="address-edit-gradient"></div>
                        </span>

                        <span
                          className="address-delete-button-container"
                          onClick={() => deleteAddress(e._id)}
                        >
                          <Delete />
                          <div className="address-delete-gradient"></div>
                        </span>
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
                          <Pin />
                          <div className="address-pin-gradient"></div>
                        </div>
                        <AddressCard address={e} />
                      </div>

                      <div className="address-buttons-container">
                        <span
                          className="address-edit-button-container"
                          onClick={() => getAddressToEdit(e._id)}
                        >
                          <Edit />
                          <div className="address-edit-gradient"></div>
                        </span>

                        <span
                          className="address-delete-button-container"
                          onClick={() => deleteAddress(e._id)}
                        >
                          <Delete />
                          <div className="address-delete-gradient"></div>
                        </span>
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
