import {makeAutoObservable} from "mobx";

class sidebar {
    sidebarIsOpen = false
    itemsAmount = 0
    constructor() {
        makeAutoObservable(this)
    }
    changeSidebarStatus(){
        this.sidebarIsOpen = !this.sidebarIsOpen
        this.sidebarIsOpen ?  document.querySelector('html').style.overflow = 'hidden' : document.querySelector('html').style.overflow = 'auto'
    }



}
export default new sidebar()