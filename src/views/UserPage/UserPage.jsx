
import React, {useEffect, useState} from 'react'
import s from './UserPage.module.scss'
import {observer} from "mobx-react-lite";
import user from '../../store/user'
import image from '../../assets/user/userImage.svg'
import { ChangeNameModal } from '../../components/UserComponents/ChangeNameModal';
import { ChangeNumberModal } from '../../components/UserComponents/ChangeNumberModal';
export const UserPage = observer(() => {
    useEffect(() => {
        user.getProfile()
    }, [])
    const [isModalName, setIsModalName] = useState(false);
    const [isModalPhone, setIsModalPhone] = useState(false);
  return (
    <div className={s.main}>
        {user.authModal === false ? 
        <div className={s.wrapper}>
            <div className={s.wrapper_image}>
                <div style={{backgroundImage: user.user.image ? `url(${user.user.image})`:`url(${image})`}} className={s.image}></div>
            </div>
            <div className={s.wrappe_profile}>
                <span>Профиль пользователя:</span>
                <div className={s.group_name}>
                    <div className={s.name}>Ваше имя: <span style={{color: user.user.name == null && 'red'}}>{user.user.name !== null ? user.user.name : "укажите ваше имя"}</span></div>
                    <div onClick={()=>setIsModalName(!isModalName)} title='Изменить имя' className={s.name_btn}></div>
                </div>
                <div className={s.group_phone}>
                    <div className={s.phone}><span>Ваш номер:</span> {user?.user?.phone}</div>
                    <div onClick={()=>setIsModalPhone(!isModalPhone)} title='Изменить номер' className={s.phone_btn}></div>
                </div>
            </div>
        </div>
        :<div className={s.authFailed}><span>Вы не авторизованы</span></div>}
        {isModalName ? <ChangeNameModal isModalName={isModalName} setIsModalName={setIsModalName}/> : <></>}
        {isModalPhone ? <ChangeNumberModal isModalPhone={isModalPhone} setIsModalPhone={setIsModalPhone}/> : <></>}
    </div>
  )
})

export default UserPage;