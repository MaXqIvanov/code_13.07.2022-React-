import {makeAutoObservable} from "mobx";

class mapbox {
    accessToken  = 'pk.eyJ1IjoiZGllbGl0IiwiYSI6ImNreGJ3b3RlOTByOHQycHE5bWwzaXlxZ2cifQ.1QkwgR8DegdGymUZL3iTjg';
    itemsAmount = 0
    constructor() {
        makeAutoObservable(this)
    }




}
export default new mapbox()