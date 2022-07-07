import React, { useEffect, useState } from 'react'
import styles from '../../scss/AuthPage.module.scss';
import InputMask from 'react-input-mask';
import { useDispatch, useSelector } from 'react-redux';
import { changeIsProfileRegistration, createUserProfile } from '../../store/profileSlice';
import ReactCodeInput from 'react-code-input';

export const RegistrationComponent = () => {
  const dispatch = useDispatch()
  const {visiblePin} = useSelector((state:any)=> state.profile)
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  
  const props:any = {
    className: 'reactCodeInput',
    inputStyle: {
      fontFamily: 'monospace',
      margin:  '4px',
      MozAppearance: 'textfield',
      width: '33px',
      borderRadius: '3px',
      fontSize: '20px',
      height: '40px',
      paddingLeft: '0px',
      backgroundColor: 'white',
      color: '#BDBDBD',
      border: '1px solid gray',
      textAlign: 'center'
    },
    inputStyleInvalid: {
      fontFamily: 'monospace',
      margin:  '4px',
      MozAppearance: 'textfield',
      width: '15px',
      borderRadius: '3px',
      fontSize: '20px',
      height: '26px',
      paddingLeft: '0px',
      backgroundColor: 'white',
      color: '#BDBDBD',
      border: '1px solid gray',
      textAlign: 'center'
    }
  }

  const submitCode = (value:any)=>{
    if(value.length === 4){
      dispatch(createUserProfile({
        first_name,
        last_name,
        phone,
        email,
        password,
        pin: value
      }))
    }
  }

  return (
    <div className={styles.registration}>
        <div className={styles.registration_wrapper}>
            <div className={styles.auth_number}><input value={first_name} onChange={(e)=>setFirstName(e.target.value)} className="custom_inputMask" type="text" placeholder='Имя'></input></div>
            <div className={styles.auth_number}><input value={last_name} onChange={(e)=>setLastName(e.target.value)} className="custom_inputMask" type="text" placeholder='Фамилия'></input></div>
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
            /></span></div></div>
            <div className={styles.auth_number}><input value={email} onChange={(e)=>setEmail(e.target.value)} className="custom_inputMask" type="email" placeholder='Электронная почта'></input></div>
            <div className={styles.auth_number}><input value={password} onChange={(e)=>setPassword(e.target.value)} className="custom_inputMask" type="password" placeholder='Пароль '></input></div>
            {visiblePin ? 
            <div className={styles.auth_pin}>
              <div className={styles.title_code}><span>Введите код из смс</span></div>
              <div className={styles.sms_input_wrapper}>
                <div className={styles.custom_inputMask_wrapper}>
                    <ReactCodeInput onChange={(e:any)=>submitCode(e)} autoFocus={true} inputMode='numeric' name='sms-input' fields={4} {...props}/>
                </div>
              </div>
              <div onClick={()=> dispatch(createUserProfile({
              first_name,
              last_name,
              phone,
              email,
              password,
              pin
            }))} className={styles.repeat_send_code}><span>Отправить код ещё раз</span></div></div> : <></>}
            <div onClick={()=> dispatch(createUserProfile({
              first_name,
              last_name,
              phone,
              email,
              password,
              pin
            }))} className={`${styles.auth_button}`}>
              <input className="btn_registration" type="button" value='Зарегистрироваться'></input>
            </div>
        </div>
        <div onClick={()=> dispatch(changeIsProfileRegistration())} className={styles.custom_close_wrapper}><i className={`bi bi-x ${styles.custom_close}`}></i></div>
    </div>
  )
}
