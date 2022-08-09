import React, { useState } from 'react';
import axios from 'axios'
import { useForm } from "react-hook-form";
import { useNotification } from '../../hooks/useNotification';
import Modal from '../common/Modal';
import { useModal } from '../../hooks/useModal';

const Address = ({ loading, setLoading, address, setAddress }) => {
    const [notification] = useNotification();

    const [addressToEditId, setaddressToEditId] = useState(null);
    const [isOpenAddForm, openModalAddForm, closeAddForm, prop] = useModal();


    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
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
    openModalAddForm();
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
        <h1>Address</h1>
        {!loading ? (
        <div>
            {React.Children.toArray(
                address?.map((e) => (
                    <div key={e.id}>
                    <p>{`${e.street_name} ${e.street_number}, ${e.zip_code}, ${e.city}, ${e.state}.`}</p>
                    <button onClick={() => editAddress(e._id)}>edit</button>
                    <button onClick={() => deleteAddress(e._id)}>
                        delete
                    </button>
                    {e.isDefault ? (
                        <p>⭐</p>
                    ) : (
                        <button onClick={() => setDefault(e._id)}>
                        set as default
                        </button>
                    )}
                    <p>- - -</p>
                    </div>
                ))
            )}
            <button
            default={loading || true}
            onClick={() => openModalAddForm(true)}
            >
            Add new address
            </button>
        </div>
        ) : (
        <p>LOADING</p>
        )}

        <Modal isOpen={isOpenAddForm} closeModal={closeAddForm}>
            <h1>{prop ? 'New address' : 'Edit address'}</h1>
            { isOpenAddForm && <form onSubmit={handleSubmit((data) => handleAddress(data, prop))}>
            <input
                type="text"
                name="state"
                placeholder="state"
                {...register("state", {
                required: true,
                })}
            />
            {errors.state && <p>Enter your residence state</p>}

            <input
                type="text"
                name="city"
                placeholder="city"
                {...register("city", {
                required: true,
                })}
            />
            {errors.city && <p>Enter your residence city</p>}

            <input
                type="text"
                name="zip_code"
                placeholder="zip code"
                {...register("zip_code", {
                required: true,
                })}
            />
            {errors.zip_code && <p>Enter your residence zip code</p>}

            <input
                type="text"
                name="street_name"
                placeholder="street name"
                {...register("street_name", {
                required: true,
                })}
            />
            {errors.street_name && <p>Enter your residence street</p>}

            <input
                type="string"
                name="street_number"
                placeholder="street number"
                {...register("street_number", {
                required: true,
                pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                },
                })}
            />
            {errors.street_number?.type === "required" && (
                <p>Enter your residence street number</p>
            )}
            {errors.street_number?.type === "pattern" && (
                <p>Enter a valid residence street number</p>
            )}

            <button>Done</button>
            </form>}
        </Modal>

    </div>
  )
}

export default Address