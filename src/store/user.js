import {makeAutoObservable} from "mobx";
import Cookies from 'js-cookie'
import authModal from "../components/AuthModal/AuthModal";
import api from "../plugins/axios/api";
import axios from "axios";



class user {
    authModal = false
    userCity = Cookies.get('userCity')
    userData = Cookies.get('userData')
    isAuth = Cookies.get('isAuth')
    constructor() {
        makeAutoObservable(this)
        this.userData !== null ?  this.isAuth = true : this.isAuth = false
        if (!Cookies.get('userCity')){
            axios.get('http://dev1.itpw.ru:8005/marketplace/city/')
                .then((response)=>{
                    console.log('====================================');
                    console.log(response);
                    console.log('====================================');
                    Cookies.set('userCity', JSON.stringify(response.data[0]), {expires:7, path:'/'})
                })
        }


    }
    changeUserData(data){
        this.userData = data
    }
    async unAuthUser(){
        await Cookies.remove('token')
        await Cookies.remove('userData')
        await Cookies.remove('isAuth')
        console.log(document.cookie)
    }
    showAuthModal(props){
        console.log(this.authModal)
        this.authModal = props
        console.log(this.authModal)
    }
    setUserCity(props){
        Cookies.set('userCity', JSON.stringify(props), {expires:7, path:'/'})
    }
}




export default new user()