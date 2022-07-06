import React from 'react'
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AuthComponent } from '../components/Auth/AuthComponent';
import { RegistrationComponent } from '../components/Auth/RegistrationComponent';
import style from '../scss/AuthPage.module.scss';
import { changeIsProfileAuthorisation, changeIsProfileRegistration } from '../store/profileSlice';
export const AuthPage = () => {
    const dispatch = useDispatch()
    const {isProfileRegistration, isProfileAuthorisation} = useSelector((state:any)=> state.profile)
      
  return (
    <div className={style.main}>
        <div className={style.main_wrapper}>
            <div className={style.carouse_custom_wrapper}>
                <Carousel className={style.slides} variant="dark">
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src="https://mykaleidoscope.ru/uploads/posts/2021-10/1634789282_56-mykaleidoscope-ru-p-klassnii-manikyur-56.jpg"
                        alt="First slide"
                        />
                        <Carousel.Caption>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src="https://ip-spravka.ru/wp-content/uploads/2019/09/post_5d8dce6b54c8a.jpeg"
                        alt="Second slide"
                        />
                        <Carousel.Caption>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src="https://alterainvest.ru/upload/iblock/a3d/a3d35ed3fb1fda84bd3d2cc4f28bae6a.jpg"
                        alt="Third slide"
                        />
                        <Carousel.Caption>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
            <div className={`mt-4 ${style.block_logo}`}>EveryServices</div>
            <div onClick={()=>dispatch(changeIsProfileAuthorisation())} className={style.block_auth}><span>Войти</span></div>
            <div onClick={()=>dispatch(changeIsProfileRegistration())} className={style.block_registration}>Зарегистрироваться</div>
        </div>
        {isProfileRegistration ? <RegistrationComponent />: <></>}
        {isProfileAuthorisation ? <AuthComponent /> : <></>}
    </div>
  )
}
