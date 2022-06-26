import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import Signout from "../Session/Signout";
import { resizer } from "../../helpers/resizer";
import { useNotification } from "../../hooks/useNotification";
import Card from "../Products/Card";
import './Profile.css'

const Profile = () => {
    const navigate = useNavigate();
    const [notification] = useNotification();
    const [isOpenAddForm, openModalAddForm, closeAddForm, prop] = useModal();
    const { section } = useParams();

    const [render, setRender] = useState(section);
    const [address, setAddress] = useState([]);
    const [newAdd, setNewAdd] = useState({});
    const [whishlist, setWhishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const wl_id = useSelector((state) => state.cartReducer.whishlist);
    const { session, username, avatar, email } = useSelector((state) => state.sessionReducer);

    useEffect(() => {
      setRender(section || 'details');
    }, [section]);

    useEffect(() => {
        if (!session) {
            navigate("/signin");
        } else {
            (async () => { 
                const { data } = await axios(`/user/address/`);
                data.address ? setAddress(data.address) : setAddress([]);
                const { data: list } = await axios(`/whishlist/`);
                list.products ? setWhishlist(list.products) : setWhishlist([]);

                setLoading(false);
             })();
        }
         // eslint-disable-next-line
    }, [wl_id]);

    //? ORDERS
    const {data: orders, oLoading} = useAxios('GET', `/order/userall/`);

    // Date formater
  const formatDate = (date) => {
    let fecha = new Date(date.slice(0, -1));
    return fecha.toString().slice(0, 21);
  };

    //? ADDRESS
    const deleteAddress = async (id) => {
        setLoading(true);
        const { data, statusText } = await axios.delete(`/user/address/${id}`);
        data.address ? setAddress(data.address) : setAddress([]);
        setLoading(false);
        notification(data.message, '/cart', `${statusText === 'OK' ? 'success' : 'warning'}`);
    };

    // set default address ⭐
    const setDefault = async (id) => { 
        const { data, statusText } = await axios.put(`/user/address/default/${id}`);
        setAddress(data.address);
        notification(data.message, '/cart', `${statusText === 'OK' ? 'success' : 'warning'}`);
     };     

  // edit/create address
    // set and open modal
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
    openModalAddForm();
  };
    // handle submit
  const handleAddress = async (e, n = false) => {
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

      if (n) {
        const { data: updated, statusText } = await axios.post(`/user/address/`, data);
        setAddress(updated.address);
        notification(updated.message, '', `${statusText === 'OK' ? 'success' : 'warning'}`);
      } else {
        const { data: updated, statusText}  = await axios.put(`/user/address/${newAdd.id}`, data);
        setAddress(updated.address);
        notification(updated.message, '', `${statusText === 'OK' ? 'success' : 'warning'}`);
      }
      setNewAdd({});
      closeAddForm();
    }
  };
    // Input Number onChange Handler
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

  return (
    <div>
      <h1>Profile</h1>
        
      <div className="profile-menu-container">
        <NavLink to={"/profile/details"}>Details</NavLink>
        <NavLink to={"/profile/orders"}>Orders</NavLink>
        <NavLink to={"/profile/address"}>Shipping address</NavLink>
        <NavLink to={"/profile/whishlist"}>Whishlist</NavLink>
        <NavLink to={"/profile/details"}><del>History</del></NavLink>
        <Signout />
      </div>

      <hr />
      <div>
        {render === "details" && (
            <div className="profile-details-container">
                <div className='profile-avatar-container'>
                    <img src={avatar ? avatar : require("../../assets/avatardefault.png")}
                    alt="avatar"
                    />
                </div>
                <h2>{username}</h2>
                <p>{email}</p>
            </div>
        )}

        {render === "orders" && (
          <div>
            <h2>Orders</h2>
            {!oLoading ? (
              <div>
                {orders?.length ? (
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
              <div className="profile-whishlistcard-container">
                {whishlist.length ? (
                  React.Children.toArray(
                    whishlist?.map((e) => (
                        <Card 
                            img={e.img}
                            name={e.product_name}
                            price={e.price}
                            brand={e.brand}
                            prodId={e.product_id}
                            free_shipping={e.free_shipping}
                            fav={wl_id.includes(e.product_id)}
                            on_sale={e.on_sale}
                        />
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
