import { useDispatch } from "react-redux";
import { loadUserData } from "../Redux/reducer/sessionSlice";
import { useNavigate } from "react-router-dom";
import { resetCartSlice } from "../Redux/reducer/cartSlice";

export const useSignout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signOut = () => {
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
                id: null,
                role: null,
                isGoogleUser: null,
            })
        );
        dispatch(resetCartSlice());
        navigate("/");
    };

    return signOut
}
