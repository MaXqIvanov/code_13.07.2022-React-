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
        api('marketplace/cart/')
            .then((response)=>{
                this.itemsAmount = response.data.result.length
            })
    }

}
export default new cart()