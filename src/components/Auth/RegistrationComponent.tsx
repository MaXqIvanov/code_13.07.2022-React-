import React from 'react'
import styles from '../../scss/AuthPage.module.scss';
import InputMask from 'react-input-mask';

export const RegistrationComponent = () => {
  return (
    <div className={styles.registration}>
        <div className={styles.registration_wrapper}>
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
      /></span></div></div>
        </div>
    </div>
  )
}
