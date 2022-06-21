import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import Signout from "../Session/Signout";
import { resizer } from "../../helpers/resizer";

const Profile = () => {
  const [render, setRender] = useState("details");
  const [address, setAddress] = useState(null);
  const [newAdd, setNewAdd] = useState({});
  const [whishlist, setWhishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { session, username, avatar, email } = useSelector(
    (state) => state.sessionReducer
  );
  const [isOpenAddForm, openModalAddForm, closeAddForm, prop] = useModal();
  const navigate = useNavigate();

  const { data: orders, oLoading } = useAxios("GET", `/order/userall/`);
  !oLoading && console.log(orders);

  useEffect(() => {
    if (!session) {
      navigate("/signin");
    } else {
      (async () => {
        const { data } = await axios(`/user/address/`);
        data.address ? setAddress(data.address) : setAddress(null);
        const { data: list } = await axios(`/whishlist/`);
        list.products ? setWhishlist(list.products) : setWhishlist(null);

        setLoading(false);
      })();
    }
    // eslint-disable-next-line
  }, []);

  const deleteAddress = async (id) => {
    setLoading(true);
    const { data } = await axios.delete(`/user/address/${id}`);
    data ? setAddress(data) : setAddress(null);
    setLoading(false);
  };

  //: edit
  const editAddress = async (id) => {
    const { data } = await axios(`/user/address/`);
    const target = data.address?.find((e) => e._id === id);
    setNewAdd({
      id,
      state: target.state,
      city: target.city,
      zip_code: target.zip_code,
      street_name: target.street_name,
      street_number: target.street_number,
    });
    openModalAddForm(false);
  };

  const handleAddress = async (e, n) => {
    e.preventDefault();
    if (
      newAdd.state &&
      newAdd.city &&
      newAdd.zip_code &&
      newAdd.street_name &&
      newAdd.street_number
    ) {
      const data = {
        state: newAdd.state,
        city: newAdd.city,
        zip_code: newAdd.zip_code,
        street_name: newAdd.street_name,
        street_number: newAdd.street_number,
      };

      if (!n) {
        const { data: updated } = await axios.put(
          `/user/address/${newAdd.id}`,
          data
        );
        setAddress(updated);
      } else {
        const { data: updated } = await axios.post(`/user/address/`, data);
        setAddress(updated);
      }
      setNewAdd({});
      closeAddForm();
    }
  };

  //: set default address
  const setDefault = async (id) => {
    const { data } = await axios.put(`/user/address/default/${id}`);
    console.log(data);
    setAddress(data);
  };

  const handleChange = ({ target }) => {
    const { name, value, validity } = target;
    let validatedValue;

    if (!validity.valid) {
      validatedValue = newAdd[name];
    } else {
      validatedValue = value;
    }
    setNewAdd({
      ...newAdd,
      [name]: validatedValue,
    });
  };

  //: Whishlist
  const removeFromWL = async (id) => {
    const { data } = await axios.delete(`/whishlist/${id}`);
    data.products ? setWhishlist(data.products) : setWhishlist(null);
  };

  const formatDate = (date) => {
    let fecha = new Date(date.slice(0, -1));
    return fecha.toString().slice(0, 21);
  };

  return (
    <div>
      <h1>Profile</h1>
      <button onClick={() => setRender("details")}>Details</button>
      <button onClick={() => setRender("orders")}>Orders</button>
      <button onClick={() => setRender("address")}>Shipping address</button>
      <button onClick={() => setRender("whishlist")}>Whishlist</button>
      <Signout />
      <hr />
      <div>
        {render === "details" && (
          <div>
            <img
              src={avatar ? avatar : require("../../assets/avatardefault.png")}
              alt="avatar"
              height={96}
            />
            <h2>{username}</h2>
            <p>{email}</p>
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        )}

        {render === "orders" && (
          <div>
            <h2>Orders</h2>
            {!oLoading ? (
              <div>
                {orders.length ? (
                  React.Children.toArray(
                    orders?.map((e) => (
                      <div key={e.id}>
                        {e.products?.map((pic) => (
                          <img
                            key={pic.img}
                            src={resizer(pic.img)}
                            alt={"product"}
                          />
                        ))}
                        <p>{e.description}</p>
                        <p>
                          shipping address:{" "}
                          {`
                                ${e.shipping_address?.street_name} 
                                ${e.shipping_address?.street_number}, 
                                ${e.shipping_address?.city} 
                            `}
                        </p>
                        <p>date: {formatDate(e.createdAt)}</p>
                        <p>payment status: {e.status}</p>
                        <p>total payment: ${e.total}</p>
                        <p>- - -</p>
                      </div>
                    ))
                  )
                ) : (
                  <p>No orders yet</p>
                )}
              </div>
            ) : (
              <p>LOADING</p>
            )}
          </div>
        )}

        {render === "address" && (
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
          </div>
        )}

        {render === "whishlist" && (
          <div>
            <h1>Whishlist</h1>
            {!loading ? (
              <div>
                {whishlist.length ? (
                  React.Children.toArray(
                    whishlist?.map((e) => (
                      <div key={e.product_id}>
                        <img src={resizer(e.img)} alt="product" />
                        <p>{e.product_name}</p>
                        <p>${e.price}</p>
                        <button onClick={() => removeFromWL(e.product_id)}>
                          💔
                        </button>
                      </div>
                    ))
                  )
                ) : (
                  <p>Whishlist empty</p>
                )}
              </div>
            ) : (
              <div>LOADING</div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isOpenAddForm} closeModal={closeAddForm}>
        <h1>New shipping address</h1>
        <form onSubmit={(e) => handleAddress(e, prop)}>
          <input
            type="text"
            name="state"
            onChange={(e) =>
              setNewAdd({
                ...newAdd,
                [e.target.name]: e.target.value,
              })
            }
            placeholder="state"
            value={newAdd.state ? newAdd.state : ""}
          />

          <input
            type="text"
            name="city"
            onChange={(e) =>
              setNewAdd({
                ...newAdd,
                [e.target.name]: e.target.value,
              })
            }
            placeholder="city"
            value={newAdd.city ? newAdd.city : ""}
          />

          <input
            type="text"
            name="zip_code"
            onChange={(e) =>
              setNewAdd({
                ...newAdd,
                [e.target.name]: e.target.value,
              })
            }
            placeholder="zip code"
            value={newAdd.zip_code ? newAdd.zip_code : ""}
          />

          <input
            type="text"
            name="street_name"
            onChange={(e) =>
              setNewAdd({
                ...newAdd,
                [e.target.name]: e.target.value,
              })
            }
            placeholder="street name"
            value={newAdd.street_name ? newAdd.street_name : ""}
          />

          <input
            type="number"
            name="street_number"
            pattern="[1-9]"
            placeholder="street number"
            value={newAdd.street_number ? newAdd.street_number : ""}
            onChange={handleChange}
          />

          <button>Done</button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
