import React, { useState, useEffect } from 'react'
import styles from '../../scss/AuthPage.module.scss';
import InputMask from 'react-input-mask';
import { useDispatch } from 'react-redux';
import { authUser, changeIsProfileAuthorisation } from '../../store/profileSlice';
import { useNavigate } from 'react-router-dom';

export const AuthComponent = () => {
  const dispatch = useDispatch()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submitAuth = ()=>{
    dispatch(authUser({phone, password, nav}))
  }
  
  return (
    <div className={styles.auth}>
        <div className={styles.auth_wrapper}>
            <div className={styles.auth_apple}><div className={styles.auth_img_apple_wrapper}><div className={styles.auth_img_apple}></div><span>Продолжить с Apple</span></div></div>
            <div className={styles.auth_vk}><div className={styles.auth_img_apple_wrapper}><div className={styles.auth_img_apple}></div><span>Продолжить с VK</span></div></div>
            <div className={styles.auth_number}><div className={styles.auth_img_apple_wrapper}><span> <InputMask className="custom_inputMask"
            formatChars={{
              "9": "[0-9]",
              a: "[A-Za-z]",
              "*": "[A-Za-z0-9]"
            }}
            mask="+7\(999) 999-99-99"
            maskChar=" "
            placeholder='+7 (999) 999-99-99'
            value={phone}
            onChange={(e:any)=>setPhone(e.target.value)}
            type="text"
          /></span></div></div>
          <div className={styles.auth_number}><input value={password} onChange={(e)=>setPassword(e.target.value)} className="custom_inputMask" type="password" placeholder='Пароль'></input></div>
          <div onClick={()=>{
            submitAuth()
          }} className={styles.btn_enter}>войти</div>
        </div>
        <div onClick={()=> dispatch(changeIsProfileAuthorisation())} className={styles.custom_close_wrapper}><i className={`bi bi-x ${styles.custom_close}`}></i></div>
    </div>
  )
}
