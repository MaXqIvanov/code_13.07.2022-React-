import {makeAutoObservable} from "mobx";
import api from "../plugins/axios/api";

class cart {
    cart = []
    itemsAmount = 0
    constructor() {
        makeAutoObservable(this)
        this.requestInfo()
    }
    addToCart(item){
        this.cart.includes(item) ? this.cart[item].qty++ : this.cart.push(item)
    }
    removeFromCart(item){
console.log()
    }
    requestInfo(){
        try {
            let allCookie = document.cookie.split(';');
            let cookie = allCookie.filter((elem)=> elem.includes('tmt'))
            cookie = cookie[0].split('=')
            api(`marketplace/cart/?tmp=${cookie[1]}`)
            .then((response)=>{
                this.itemsAmount = response.data.result.length
            })
        } catch (error) { 
            api(`marketplace/cart/`)
            .then((response)=>{
                this.itemsAmount = response.data.result.length
            }) 
        }
        // api(`marketplace/cart/?tmp=${twt}`)
    }

}
export default new cart()