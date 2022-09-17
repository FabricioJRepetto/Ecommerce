import { useDispatch } from 'react-redux'
import { sendNotif } from '../Redux/reducer/notificationSlice';

export const useNotification = () => {
    const dispatch = useDispatch();

    const notification = (message, url, type) => {
        if (message) {
            dispatch(sendNotif({
                message,
                url,
                type,
                status: 'new',
            }));
        }
    }

    return notification
}