import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNotification } from "../../hooks/useNotification";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import { CloseIcon } from "@chakra-ui/icons";
import "../../App.css";

const Address = ({ loading, setLoading, address, setAddress }) => {
  const [notification] = useNotification();

  const [addressToEditId, setaddressToEditId] = useState(null);
  const [isOpenAddForm, openAddForm, closeAddForm, prop] = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  //? ADDRESS
  const deleteAddress = async (id) => {
    setLoading(true);
    const { data, statusText } = await axios.delete(`/address/${id}`);
    data.address ? setAddress(data.address) : setAddress([]);
    setLoading(false);
    notification(
      data.message,
      "",
      `${statusText === "OK" ? "success" : "warning"}`
    );
  };

  // set default address
  const setDefault = async (id) => {
    const { data, statusText } = await axios.put(`/address/default/${id}`);
    setAddress(data.address);
    notification(
      data.message,
      "/cart",
      `${statusText === "OK" ? "success" : "warning"}`
    );
  };

  // edit/create address
  // set and open modal
  const editAddress = async (id) => {
    const { data } = await axios(`/address/`);
    const target = data.address?.find((e) => e._id === id);
    openAddForm();
    setaddressToEditId(id);
    setValue("state", target.state);
    setValue("city", target.city);
    setValue("zip_code", target.zip_code);
    setValue("street_name", target.street_name);
    setValue("street_number", target.street_number);
    setValue("isDefault", target.isDefault);
  };
  // handle submit
  const handleAddress = async (addressData, n = false) => {
    if (n) {
      const { data: updated, statusText } = await axios.post(
        `/address/`,
        addressData
      );
      setAddress(updated.address);
      notification(
        updated.message,
        "",
        `${statusText === "OK" ? "success" : "warning"}`
      );
    } else {
      console.log(addressData);
      const { data: updated, statusText } = await axios.put(
        `/address/${addressToEditId}`,
        addressData
      );
      setAddress(updated.address);
      notification(
        updated.message,
        "",
        `${statusText === "OK" ? "success" : "warning"}`
      );
    }
    reset();
    closeAddForm();
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
                <button onClick={() => editAddress(e._id)}>Editar</button>
                <button onClick={() => deleteAddress(e._id)}>Eliminar</button>
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
        <h1>{prop ? "Agregar dirección" : "Editar dirección"}</h1>
        {isOpenAddForm && (
          <form onSubmit={handleSubmit((data) => handleAddress(data, prop))}>
            <>
              {errors.state ? (
                <p className="g-error-input">Ingresa la provincia</p>
              ) : (
                <p className="g-hidden-placeholder">hidden</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                name="state"
                placeholder="Provincia"
                {...register("state", {
                  required: true,
                })}
              />
              {watch("state") === "" || watch("state") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("state", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {errors.city ? (
                <p className="g-error-input">Ingresa la ciudad</p>
              ) : (
                <p className="g-hidden-placeholder">hidden</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                {...register("city", {
                  required: true,
                })}
              />
              {watch("city") === "" || watch("city") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("city", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {errors.zip_code ? (
                <p className="g-error-input">Ingresa el código postal</p>
              ) : (
                <p className="g-hidden-placeholder">hidden</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                name="zip_code"
                placeholder="Código postal"
                {...register("zip_code", {
                  required: true,
                })}
              />
              {watch("zip_code") === "" ||
              watch("zip_code") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("zip_code", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {errors.street_name ? (
                <p className="g-error-input">Ingresa la calle</p>
              ) : (
                <p className="g-hidden-placeholder">hidden</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                name="street_name"
                placeholder="Calle"
                {...register("street_name", {
                  required: true,
                })}
              />
              {watch("street_name") === "" ||
              watch("street_name") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("street_name", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <>
              {!errors.street_number && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errors.street_number?.type === "required" && (
                <p className="g-error-input">Ingresa la altura</p>
              )}
              {errors.street_number?.type === "pattern" && (
                <p className="g-error-input">Ingresa un número válido</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="string"
                name="street_number"
                placeholder="Altura"
                {...register("street_number", {
                  required: true,
                  pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                  },
                })}
              />
              {watch("street_number") === "" ||
              watch("street_number") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("street_number", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>

            <button className="g-white-button">
              {prop ? "Agregar dirección" : "Editar dirección"}
            </button>
            <button
              onClick={() => closeAddForm(true)}
              className="g-white-button"
            >
              Cancelar
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Address;
