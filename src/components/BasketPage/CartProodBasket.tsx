import React from 'react'
import styles from '../../scss/BasketPage.module.scss';

export const CartProodBasket = ({elem}:any) => {
  return (
    <div className={styles.cart_basket}>
        <div className={styles.cart_basket_wrapper}>
          {/* <div style={{backgroundImage: `url(${elem.img})`}} className={styles.basket_img}></div> */}
          <div>{elem.id}</div>
        </div>
    </div>
  )
}
