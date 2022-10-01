import { useDispatch, useSelector } from "react-redux";
import { reconnectNeeded, loadUserData } from "../Redux/reducer/sessionSlice";
import { useNavigate } from "react-router-dom";
import { resetCartSlice } from "../Redux/reducer/cartSlice";
import { useNotification } from "./useNotification";

export const useSignout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notification = useNotification();
    const session = useSelector((state) => state.sessionReducer.session);

    function signOut(notif) {
        if (session) { }

        console.log('entra signout');
        window.localStorage.removeItem("loggedTokenEcommerce");
        dispatch(
            loadUserData({
                session: false,
                username: null,
                full_name: {
                    first: null,
                    last: null,
                },
                avatar: null,
                email: null,
                emailVerified: null,
                id: null,
                role: null,
                isGoogleUser: null,
            })
        );
        dispatch(resetCartSlice());
        navigate("/");

        if (notif) {
            notification("Por favor vuelve a iniciar sesión", "/signin", "error", true);
            dispatch(reconnectNeeded(false));
        }

    }

    return signOut
}
