import {makeAutoObservable} from "mobx";
import Cookies from 'js-cookie'
import authModal from "../components/AuthModal/AuthModal";
import api from "../plugins/axios/api";
import axios from "axios";


class user {
    user = {}
    profileVisible = false
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
                    Cookies.set('userCity', JSON.stringify(response.data.results[0]), {expires:7, path:'/'})
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
    getProfile(){
        api('accounts/profile/profile/')
        .then((response)=>{
            this.user = response.data
        })
    }
    changeProfileVisible(){
        this.profileVisible = !this.profileVisible
    }
    changeName = ({input_name})=>{
        api.put('accounts/profile/change_name/',{
            name: input_name
        })
        .then((response)=>{
            this.user = response.data
        })
    }  
    changePhone = (data)=>{
        this.user = data.user;
    } 
}




export default new user()