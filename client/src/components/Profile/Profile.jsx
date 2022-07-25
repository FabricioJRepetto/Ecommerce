import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAxios } from "../../hooks/useAxios";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import Signout from "../Session/Signout";
import { resizer, avatarResizer } from "../../helpers/resizer";
import { useNotification } from "../../hooks/useNotification";
import Card from "../Products/Card";
import MiniCard from "../Products/MiniCard";
import { loadAvatar, loadFullName, loadUsername } from "../../Redux/reducer/sessionSlice";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [notification] = useNotification();
  const [isOpenAddForm, openModalAddForm, closeAddForm, prop] = useModal();
  const [isOpenAvatar, openAvatar, closeAvatar] = useModal();
  const [isOpenDetails, openDetails, closeDetails] = useModal();
  const [isOpenForgotPassword, openForgotPassword, closeForgotPassword] = useModal();
  const { section } = useParams();
  const dispatch = useDispatch();

  const [render, setRender] = useState(section);
  const [address, setAddress] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressToEditId, setaddressToEditId] = useState(null);

  const { wishlist: wl_id } = useSelector((state) => state.cartReducer);
  const { session, id, username, avatar, email, role, full_name, isGoogleUser } = useSelector(
    (state) => state.sessionReducer
  );
  const [details, setDetails] = useState({username, first: full_name.first, last: full_name.last});

  const [newAvatar, setNewAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
  } = useForm();

  useEffect(() => {
    setRender(section || "details");
  }, [section]);

  useEffect(() => {
    if (!session) {
      navigate("/signin");
    } else {
      (async () => {
        const requests = [
            axios(`/address/`),
            axios(`/wishlist/`),
            axios(`/history/`),
        ];
        const p = await Promise.allSettled(requests);

        p[0].value ? setAddress(p[0].value.data.address) : setAddress([]);
        p[1].value ? setWishlist(p[1].value.data.products) : setWishlist([]);
        p[2].value ? setHistory(p[2].value.data.products) : setHistory([]);
        
        p[1].value.data.message && notification(p[1].value.data.message, '', 'warning');
        
        setLoading(false);
      })();
    }
    // eslint-disable-next-line
  }, [wl_id]);

  //? ORDERS
  const { data: orders, oLoading } = useAxios("GET", `/order/userall/`);
  // Date formater
  const formatDate = (d) => {
    return d.toString().slice(0, -13).replace('T', ' ');
  };

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

    const avatarHandler = (e) => {
        setNewAvatar(e.target.files);
        setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }

    const uploadAvatar = async () => { 
        let formData = new FormData();

        const fileListArrayImg = Array.from(newAvatar);

        fileListArrayImg.forEach((pic) => {
            formData.append("images", pic);
        });

        const { data, statusText } = await axios.post('/user/avatar', formData, {
            headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        notification(data.message, '', `${statusText === 'OK' ? 'success' : 'warning'}`);
        dispatch(loadAvatar(data.avatar))
     }

     const detailsHandler = async (e) => {
        e.preventDefault();
        const { data, statusText } = await axios.put('/user/editProfile', details);
        
        dispatch(loadFullName({first: data.user.firstName, last: data.user.lastName}));
        dispatch(loadUsername(data.user.username));
        notification(data.message, '', `${statusText === 'OK' ? 'success' : 'warning'}`);
        closeDetails();
      }

    const emailRegex = /^[\w-.]+@([\w-])+[.\w-]*$/i;

    const forgotPassword = (email) => {
        console.log(email);
        axios
        .put("/user/forgotPassword", email)
        .then(({ data }) => {
            console.log(data);
        })
        .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
    };

    return (
        <div className="profile-container">
            <h1>Mi perfil</h1>

            <div className="profile-menu-container">
                <NavLink to={"/profile/details"}>Detalles</NavLink>
                <NavLink to={"/profile/orders"}>Mis compras</NavLink>
                <NavLink to={"/profile/wishlist"}>Favoritos</NavLink>
                <NavLink to={"/profile/history"}>Historial</NavLink>
                <Signout />
            </div>

            <hr />
            <div>
                {render === "details" && (
                <div className="profile-details-container">
                    <div className="profile-avatar-container">
                    <img
                        src={
                        avatar ? avatarResizer(avatar) : require("../../assets/avatardefault.png")
                        }
                        referrerPolicy="no-referrer"
                        alt="avatar"
                        onClick={openAvatar}
                        style={{ cursor: 'pointer'}}
                    />
                    </div>
                    <h2>{username}</h2>
                    <p>{email}</p>
                    <p>{`${full_name.first || ''} ${full_name.last || ''}`}</p>
                    <br />
                    <i>{id}</i>
                    <p>{role}</p>
                    <br />
                    <button onClick={openDetails}>Editar detalles</button>
                    <br />
                    {!isGoogleUser && <button onClick={openForgotPassword}>Cambiar contraseña</button>}
                    <br />
                    <div>{address 
                        ? React.Children.toArray(address.map((e) => (
                            e.isDefault && <div key={e.id}>
                            <p>{`${e.street_name} ${e.street_number}, ${e.zip_code}, ${e.city}, ${e.state}.`}</p>
                            {e.isDefault && <p>⭐</p>}
                            </div>
                        )))
                        : 'Aún no tienes un dirección seleccionada'}</div>
                    <button onClick={()=> navigate("/profile/address")}>Direcciones</button>
                </div>
                )}

                {render === "orders" && (
                <div>
                    <h2>Orders</h2>
                    {!oLoading ? (
                    <div className="profile-orders-container">
                        {orders?.length ? (
                        React.Children.toArray(
                            orders?.map((e) => (
                            <div className="profile-img-orders-container" key={e.id}>
                                {e.products?.map((pic) => (
                                <img
                                    key={pic.img}
                                    src={resizer(pic.img)}
                                    alt={"product"}
                                />
                                ))}
                                <p>{e.description}</p>
                                <p>creation date: {formatDate(e.expiration_date_from)}</p>
                                {e.status === 'pending' && `expiration: ${formatDate(e.expiration_date_to)}`}
                                <p>- - -</p>
                                <p>payment status: {e.status}</p>
                                {e.status === 'pending' && e.payment_link && <div><a style={{ color: '#3483fa'}} href={e.payment_link}>Continue payment.</a></div>} 
                                <p>{e.payment_source}</p>
                                <p>order id: <i>{e.id}</i></p>
                                <p>- - -</p>
                                <p>
                                shipping address:{" "}
                                {`
                                        ${e.shipping_address?.street_name} 
                                        ${e.shipping_address?.street_number}, 
                                        ${e.shipping_address?.city} 
                                    `}
                                </p>
                                <p>free shipping: {e.free_shipping ? "Yes" : "No"}</p>
                                <p>shipping cost: {e.shipping_cost}</p>
                                <p>total payment: ${e.total}</p>
                                <hr />
                                <br />
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

                {render === "wishlist" && (
                <div>
                    <h1>Wishlist</h1>
                    {!loading ? (
                    <div className="profile-wishlistcard-container">
                        {wishlist.length ? (
                        React.Children.toArray(
                            wishlist?.map((product) => (
                            <Card
                                productData={product}
                                fav={wl_id.includes(product._id)}
                            />
                            ))
                        )
                        ) : (
                        <p>Wishlist empty</p>
                        )}
                    </div>
                    ) : (
                    <div>LOADING</div>
                    )}
                </div>
                )}

                {render === "history" && (
                <div>
                    <h1>History</h1>
                    {!loading ? (
                    <div className="profile-history-container">
                        {history.length ? (
                        React.Children.toArray(
                            history?.map((e) => (
                            <MiniCard
                                key={e._id}
                                img={e.thumbnail}
                                name={e.name}
                                price={e.price}
                                sale_price={e.sale_price}
                                discount={e.discount}
                                prodId={e._id}
                                free_shipping={e.free_shipping ? true : false}
                                on_sale={e.on_sale}
                                fav={wl_id.includes(e._id)}
                                fadeIn={true}
                            />
                            ))
                        )
                        ) : (
                        <p>History empty</p>
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

            <Modal isOpen={isOpenAvatar} closeModal={closeAvatar}>
                {isOpenAvatar &&<div>
                    <h1>editar avatar</h1>
                    <div className='avatar-preview' >
                        <img src={avatarPreview ? avatarPreview : avatarResizer(avatar)}  alt="avatar-preview" />
                    </div>
                    <input 
                        type="file"
                        name="image"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={avatarHandler}
                        id="filesButton"
                    />
                    <button onClick={uploadAvatar}>actualizar avatar</button>
                </div>}
            </Modal>

            <Modal isOpen={isOpenDetails} closeModal={closeDetails}>
                { isOpenDetails &&<form onSubmit={detailsHandler}>
                    <input 
                        type="text" 
                        placeholder="Nombre de usuario" 
                        value={details.username} 
                        maxLength="20"
                        onChange={(e)=> setDetails({...details, [e.target.name]: e.target.value})} name='username'/>
                    <input 
                        type="text" 
                        placeholder="Primer nombre" 
                        value={details.first}
                        maxLength="20"
                        onChange={(e)=> setDetails({...details, [e.target.name]: e.target.value})} 
                        name='first'/>
                    <input 
                        type="text" 
                        placeholder="Apellido" 
                        value={details.last} 
                        maxLength="20"
                        onChange={(e)=> setDetails({...details, [e.target.name]: e.target.value})} 
                        name='last'/>
                    <button>Actualizar</button>
                </form>}
            </Modal>

            <Modal isOpen={isOpenForgotPassword} closeModal={closeForgotPassword}>
                <form onSubmit={handleSubmitForgot(forgotPassword)}>
                <h2>Ingrese su email para reestablecer la contraseña</h2>
                <input
                    type="text"
                    placeholder="email"
                    autoComplete="off"
                    {...registerForgot("email", {
                    required: true,
                    pattern: emailRegex,
                    })}
                />
                {errorsForgot.emailForgot?.type === "required" && (
                    <p>Ingresa tu email</p>
                )}
                {errorsForgot.emailForgot?.type === "pattern" && (
                    <p>Ingresa un email válido</p>
                )}
                <input type="submit" value="Enviar email" />
                </form>
            </Modal>

        </div>
    );
};

export default Profile;
