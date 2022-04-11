import React, {useState} from 'react';
import styles from './AuthModal.module.css'
import {Button, Form, Modal} from "react-bootstrap";
import api from "../../plugins/axios/api";
import user from "../../store/user";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {observer} from "mobx-react-lite";


const AuthModal = observer(() => {
    const [cookies, setCookie, removeCookie] = useCookies(['token','isAuth','userData']);
    let [phoneHolder, setPhoneHolder] = useState('')
    let [otcHolder, setOtcHolder] = useState('')
    let [formStageHolder, setFormStageHolder] = useState(1)
    const [loginValidated, setLoginValidated] = useState(false);

    let navigate = useNavigate()

    function onSubmitLoginForm(){
        formStageHolder === 1 ?
            api.post('accounts/auth/phone_auth/',{
                'phone':phoneHolder
            })
                .then((response)=>{
                    response.status === 200 ?
                        setFormStageHolder(2)
                        :
                        console.log(response.response)
                })
                .catch((error)=>{
                    console.log(error.response)
                })
            :
            api.post('accounts/auth/phone_auth/',{
                phone:phoneHolder,
                otc: otcHolder
            })
                .then((response)=>{
                    if (response.status === 200){
                        setCookie("token",response.data.token, {maxAge: 31536000, path: '/' })
                        setCookie("userData",response.data.user, {maxAge: 31536000, path: '/'})
                        setCookie("isAuth",true, {maxAge: 31536000, path: '/' })
                        user.changeUserData(response.data.user)
                        user.showAuthModal(false)
                        navigate(0)
                    }
                })
                .catch((error)=>{
                    console.log(error)
                })
    }
    function resetLoginForm(){
        setPhoneHolder('')
        setOtcHolder('')
        setFormStageHolder(1)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else{
            onSubmitLoginForm()
            event.preventDefault();
            event.stopPropagation();
        }

        setLoginValidated(true);
    };
    async function unAuthUser(){
        await user.unAuthUser()
        await navigate(0)
    }

    return (
        <Modal centered show={user.authModal} onHide={()=>{user.showAuthModal(false)}}>
            <Form noValidate validated={loginValidated} onSubmit={handleSubmit}  >
                <Modal.Header closeButton>
                    <Modal.Title>Авторизация</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form.Group className="mb-3">
                        <Form.Label required htmlFor="phoneInput">Номер телефона</Form.Label>
                        <Form.Control readOnly={formStageHolder === 2} required type={'phone'} onInput={(event)=>{setPhoneHolder(event.target.value)}} id="phoneInput" placeholder="+7-(___)-___-__-__" />
                    </Form.Group>
                    {formStageHolder === 2 &&
                        <Form.Group className="mb-3">
                            <Form.Label  htmlFor="otcInput">Код</Form.Label>
                            <Form.Control   type={'phone'} onInput={(event) => {
                                setOtcHolder(event.target.value)
                            }} id="otcInput" placeholder="OTC"/>
                        </Form.Group>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>{user.showAuthModal(false)}}>
                        Закрыть
                    </Button>
                    <Button type={'submit'} variant="primary" >
                        Войти
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
});

export default AuthModal;
