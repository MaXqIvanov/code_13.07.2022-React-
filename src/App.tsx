import './App.scss';
import React, { Suspense, useEffect } from 'react';
import {Header} from "./components/Header";
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import {MainPage} from "./views/MainPage";
import { Spinner } from "react-bootstrap";
import {useCookies} from "react-cookie";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileAsync } from './store/profileSlice';
import { AuthPage } from './views/AuthPage';
import {useParams} from "react-router-dom";
// const UserPage = React.lazy(() => import('./views/UserPage/UserPage'));

export const App = () => {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const {userAuth} = useSelector((state:any)=> state.profile);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'tmt']);
  const urlParams = useParams()

  useEffect(() => {
    dispatch(getProfileAsync({nav, urlParams}))
  }, [])
  
  return (
    <>
        {!userAuth ? <Header></Header> : <></> }
        <div className={'wrapper'}>
        <Routes>
            <Route path={'/'} element={<MainPage />} />
            <Route path={'/auth'} element={<AuthPage />} />
        </Routes>
        </div>
    </>    
  );
}
