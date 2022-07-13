import React from 'react'
import styles from '../../scss/OrdersPage.module.scss';

export const ModalAddressAdded = ({setVisibleAddress}:any) => {
  return (
    <div className={styles.address_added}>
        <div className={styles.address_added_wrapper}>
            добавление адресса
            <i onClick={()=>setVisibleAddress(false)} className={`bi bi-x ${styles.close_btn}`}></i>
        </div>
    </div>
  )
}
