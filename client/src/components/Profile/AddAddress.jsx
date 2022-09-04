import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { CloseIcon } from "@chakra-ui/icons";
import { useNotification } from "../../hooks/useNotification";
import { avoidEnterSubmit } from "../../helpers/AvoidEnterSubmit";
import "../../App.css";
import "./AddAddress.css";

const AddAddress = ({
  prop,
  setAddressToEdit,
  addressToEdit,
  addressToEditId,
  setAddress,
  closeAddForm,
  setSelectedAdd,
  getAddress,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();
  const [notification] = useNotification();
  const location = useLocation();

  useEffect(() => {
    if (addressToEdit) {
      setValue("state", addressToEdit.state);
      setValue("city", addressToEdit.city);
      setValue("zip_code", addressToEdit.zip_code);
      setValue("street_name", addressToEdit.street_name);
      setValue("street_number", addressToEdit.street_number);
      setValue("isDefault", addressToEdit.isDefault);
      setAddressToEdit(null);
    }
    // eslint-disable-next-line
  }, []);

  // handle submit
  const handleAddress = async (addressData, prop) => {
    if (prop) {
      const { data, statusText } = await axios.post(`/address/`, addressData);
      setAddress(data.address);
      notification(
        `${
          statusText === "OK"
            ? "Nueva dirección creada correctamente."
            : "Algo salió mal."
        }`,
        "",
        `${statusText === "OK" ? "success" : "warning"}`
      );

      if (location.pathname !== "/profile/address") {
        setSelectedAdd(data.address.pop());
        getAddress();
      }
    } else {
      const { data, statusText } = await axios.put(
        `/address/${addressToEditId}`,
        addressData
      );
      setAddress(data.address);
      notification(
        `${
          statusText === "OK"
            ? "Dirección actualizada correctamente."
            : "Algo salió mal."
        }`,
        "",
        `${statusText === "OK" ? "success" : "warning"}`
      );
    }
    reset();
    closeAddForm();
  };

  return (
    <div>
      <h1>{prop ? "Agregar dirección" : "Editar dirección"}</h1>
      <form
        onSubmit={handleSubmit((data) => handleAddress(data, prop))}
        onKeyDown={avoidEnterSubmit}
        className="addaddress-form"
      >
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

        <div className="add-address-buttons-container">
          <button className="g-white-button">
            {prop ? "Agregar dirección" : "Editar dirección"}
          </button>
          <button onClick={() => closeAddForm(true)} className="g-white-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
