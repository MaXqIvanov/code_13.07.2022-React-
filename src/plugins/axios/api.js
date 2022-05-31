import axios from 'axios';
import Cookies from "js-cookie";
import user from "../../store/user";

 const api = axios.create({
    baseURL : "http://dev1.itpw.ru:8005/",
    headers : {
        'Authorization': Cookies.get('token') ? "Bearer " + Cookies.get('token') : null,
    }
});
api.interceptors.response.use(undefined, (error) => {
    if (error.response && error.response.status === 401) {
       user.showAuthModal(true)
    }
});

export default api