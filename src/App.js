import './App.css';

import Header from "./components/Header";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainPage from "./views/MainPage";
import SearchPage from "./views/SearchPage/SearchPage";
import CategoryPage from "./views/CategoryPage/CategoryPage";
import Sidebar from "./components/Sidebar/Sidebar";
import sidebar from "./store/sidebar";
import {observer} from "mobx-react-lite";
import ItemPage from "./views/ItemPage/ItemPage";
import CartPage from "./views/CartPage/CartPage";
import OrderListPage from "./views/OrderListPage/OrderListPage";
import OrderItem from "./views/OrderItem/OrderItem";

const App = observer(() => {
  return (
    <div  className={sidebar.sidebarIsOpen === true ? 'AppOverflowOff' : 'App'}>

        <Router>
            <Header></Header>
            <Sidebar></Sidebar>
            <div className={'wrapper'}>
            <Routes>
                <Route exact path={'/'} element={<MainPage />} />
                <Route exact path={'/search'} element={<SearchPage />} />
                <Route exact path={'/cart'} element={<CartPage/>} />
                <Route exact path={'/orders'} element={<OrderListPage/>} />
                <Route exact path={'/order/:id'} element={<OrderItem/>} key={':id'} />
                <Route exact  path={'/item/:id'} element={<ItemPage key={':id'} />} />
                <Route exact  path={'/category/:id'}  element={<CategoryPage key={':id'} />} />
            </Routes>
            </div>
        </Router>

    </div>
  );
})

export default App;
