import './App.css';
import React, { Suspense, useEffect } from 'react';
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
import { Spinner } from "react-bootstrap";
import user from './store/user';
import UserPage from './views/UserPage/UserPage';
import {useCookies} from "react-cookie";
import { v4 as uuidv4 } from 'uuid';
// const UserPage = React.lazy(() => import('./views/UserPage/UserPage'));

const App = observer(() => {
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'tmt']);
  if(cookies.token){
    // вопрос
    removeCookie("tmt")
  }else {
    if(cookies.tmt){

    }else{
      let tempToken = uuidv4();
      setCookie("tmt", tempToken, {maxAge: 31536000, path: '/' })
    }
  }
  
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
                {/* <Route path="/user" element={
                  <Suspense fallback={<div className='async_loading'><Spinner className='spinner_fallback' animation="grow" /></div>}>
                      <UserPage />
                  </Suspense>
                }/> */}
            </Routes>
            </div>
        </Router>
        {user.profileVisible ? <UserPage /> :<></>}
    </div>
  );
})

export default App;
