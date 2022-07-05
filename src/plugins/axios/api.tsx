import axios from 'axios';
import Cookies from "js-cookie";

 const api:any = axios.create({
    baseURL : "https://everyservices.itpw.ru/",
    headers : {
        'Authorization': Cookies.get('token') ? "Bearer " + Cookies.get('token') : null as any,
    }
});
api.interceptors.response.use(undefined, (error:any) => {
    if (error.response && error.response.status === 401) {
        return error.response;
    }
    else {
        return error.response;
    }
});

export default api