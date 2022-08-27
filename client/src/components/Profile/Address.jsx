import React, { useState } from "react";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import "../../App.css";
import AddAddress from "./AddAddress";

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
      `${
        statusText === "OK"
          ? "Dirección eliminada correctamente."
          : "Algo salió mal."
      }`,
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
          ? "Dirección predeterminada establecida correctamente."
          : "Algo salió mal."
      }`,
      "/cart",
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
    <div>
      <h1>Dirección</h1>
      {!loading ? (
        <div>
          {React.Children.toArray(
            address?.map((e) => (
              <div key={e.id}>
                <p>{`${e.street_name} ${e.street_number}, ${e.zip_code}, ${e.city}, ${e.state}.`}</p>
                <button
                  onClick={() => getAddressToEdit(e._id)}
                  className="g-white-button"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteAddress(e._id)}
                  className="g-white-button"
                >
                  Eliminar
                </button>
                {e.isDefault ? (
                  <p>⭐</p>
                ) : (
                  <button onClick={() => setDefault(e._id)}>
                    Establecer como predeterminada
                  </button>
                )}
                <p>- - -</p>
              </div>
            ))
          )}
          <button
            default={loading || true}
            onClick={() => openAddForm(true)}
            className="g-white-button"
          >
            Agregar dirección
          </button>
        </div>
      ) : (
        <p>LOADING</p> /* //! VOLVER A VER agregar loader */
      )}

      <Modal isOpen={isOpenAddForm} closeModal={closeAddForm}>
        {isOpenAddForm && (
          <AddAddress
            setAddressToEdit={setAddressToEdit}
            addressToEdit={addressToEdit}
            setAddress={setAddress}
            closeAddForm={closeAddForm}
            prop={prop}
            addressToEditId={addressToEditId}
          />
        )}
      </Modal>
    </div>
  );
};

export default Address;
