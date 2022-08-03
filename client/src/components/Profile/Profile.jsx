import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import Signout from "../Session/Signout";
import { avatarResizer } from "../../helpers/resizer";
import { useNotification } from "../../hooks/useNotification";
import { loadAvatar, loadFullName, loadUsername } from "../../Redux/reducer/sessionSlice";
import "./Profile.css";
import Orders from "./Orders";
import Address from "./Address";
import Wishlist from "./Wishlist";
import History from "./History";



const Profile = () => {
  const navigate = useNavigate();
  const [notification] = useNotification();
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

  const { wishlist: wl_id } = useSelector((state) => state.cartReducer);
  const { session, id, username, avatar, email, role, full_name, isGoogleUser } = useSelector(
    (state) => state.sessionReducer
  );
  const [details, setDetails] = useState({username, first: full_name.first, last: full_name.last});

  const [newAvatar, setNewAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//   } = useForm();

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

    const avatarHandler = (e) => {
        setNewAvatar(e.target.files);
        setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }

    const uploadAvatar = async (e) => {
        e.target.disabled = true;
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
        dispatch(loadAvatar(data.avatar));
        closeAvatar();
     }

     const detailsHandler = async (e) => {
        e.preventDefault();
        e.target.disabled = true;

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
                    <Orders />
                )}

                {render === "address" && (
                    <Address loading={loading}/>
                )}

                {render === "wishlist" && (
                    <Wishlist loading={loading} wishlist={wishlist} wl_id={wl_id}/>
                )}

                {render === "history" && (
                    <History loading={loading} history={history} wl_id={wl_id}/>
                )}
            </div>

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