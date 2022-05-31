
import React, {useState} from 'react'
import {Button, Form, Label} from "react-bootstrap";
import { useForm } from 'react-hook-form';
import user from '../../store/user'
import s from '../../views/UserPage/UserPage.module.scss';
import api from "../../plugins/axios/api";
import axios from 'axios';
import Cookies from "js-cookie";
import {useCookies} from "react-cookie";

export const ChangeNumberModal = ({isModalPhone, setIsModalPhone}) => {
    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset,
      } = useForm({
        mode: 'onSubmit',
      });
      const [cookies, setCookie, removeCookie] = useCookies(['token']);
      const [isVisibleFolder, setVisibleFolder] = useState(false);
      const changeNumber = ({input_phone, input_otc})=>{
        if(isVisibleFolder==false){
            api.put('accounts/profile/change_phone/',{
                "phone": `${input_phone}`,
            })
            .then((response)=>{
                setVisibleFolder(true)
            })
        }
        else {
            axios.put('http://dev1.itpw.ru:8005/accounts/profile/change_phone/',{
                "phone": `${input_phone}`,
                "otc": `${input_otc}`
            },{
                headers : {
                    'Authorization': Cookies.get('token') ? "Bearer " + Cookies.get('token') : null,
                },
            })
            .then((response)=>{
                console.log(response.data);
                user.changePhone(response.data)
                setCookie("token", response.data.token, {maxAge: 31536000, path: '/' })
            })
            .catch((error)=>{
                if(error.response.status===400){
                    alert('Вы ввели не правильный код,повторите попытку')
                }
            })
            .finally(()=>setIsModalPhone(!isModalPhone))
        }
           
    } 

  return (
    <div className={s.modal_name}> 
    <Form onSubmit={handleSubmit(changeNumber)}  >
           <div className={s.form_group_inputphone}>
               <div className={s.wrapper_form_group_inputname}>
                    <Form.Label required htmlFor="phoneInput">Номер телефона</Form.Label>
                    <Form.Control
                        {...register('input_phone', {
                        required: 'Поле обязательно для заполнения',
                        minLength: {
                            value: 10,
                            message: 'минимальная длина 10 символа',
                        },
                        maxLength: {
                            value: 11,
                            message: 'максимальная длина 11 символов',
                        },
                        })}
                        type="number"
                        placeholder="+7-(___)-___-__-__"
                        // className={s.formControl_numberModal}
                        id='phoneInput'
                    />
                    {isVisibleFolder ? 
                        <><Form.Label required htmlFor="phoneInput">КОД</Form.Label><Form.Control
                              {...register('input_otc', {
                                  required: 'Поле обязательно для заполнения',
                                  minLength: {
                                      value: 4,
                                      message: 'минимальная длина 4 символа',
                                  },
                                  maxLength: {
                                      value: 4,
                                      message: 'максимальная длина 4 символов',
                                  },
                              })}
                              type="number"
                              placeholder="ОТС" /></>
                        :<></>}
                    <div className={s.errors_name}>{errors?.input_phone ? <span>{errors?.input_phone?.message}</span>: errors?.input_otc ? <span>{errors?.input_otc?.message}</span> : <></>}</div>
                    <div className={s.wrap_btn_phone}>
                        <Button className={s.btn_numberModal} variant="secondary" type="submit">
                            Подтвердить
                        </Button>
                    </div>
              </div>
          </div>
          <div onClick={()=>setIsModalPhone(!isModalPhone)} title='закрыть окно' className={s.btn_close_modal_name}></div>
    </Form>
  </div>
  )
}
