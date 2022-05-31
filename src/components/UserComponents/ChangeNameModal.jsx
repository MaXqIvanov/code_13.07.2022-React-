
import React from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import { useForm } from 'react-hook-form';
import user from '../../store/user'
import s from '../../views/UserPage/UserPage.module.scss';
export const ChangeNameModal = ({isModalName, setIsModalName}) => {

    const {
      register,
      formState: { errors, isValid },
      handleSubmit,
      reset,
    } = useForm({
      mode: 'onSubmit',
    });
    const changeNameFunc = (data)=>{
      user.changeName(data)
      setIsModalName(!isModalName)
    }
  return (
    <div className={s.modal_name}> 
     <div className={s.wrapper_for_btn_changeName}>
        <Form onSubmit={handleSubmit(changeNameFunc)}  >
              <div className={s.form_group_inputname}>
                  <Form.Control
                    {...register('input_name', {
                      required: 'Поле обязательно для заполнения',
                      minLength: {
                        value: 2,
                        message: 'минимальная длина 2 символа',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Слишком большое сообщение',
                      },
                    })}
                    as="input"
                    placeholder="Ваше имя"
                  />
                  <div className={s.errors_name}>{errors?.input_name ? <span>{errors?.input_name?.message}</span>:<></>}</div>
                  <div className={s.wrap_btn_name}>
                    <Button variant="secondary" type="submit">
                        Подтвердить
                    </Button>
                  </div>
              </div>
              <div onClick={()=>setIsModalName(!isModalName)} title='закрыть окно' className={s.btn_close_modal_name}></div>
        </Form>
      </div>
    </div>
  )
}
