import React from 'react'
import { useSelector } from 'react-redux';
import { CartProodBasket } from '../components/BasketPage/CartProodBasket';
import styles from '../scss/BasketPage.module.scss';

export const BasketPage = () => {
  const {prood_basket} = useSelector((state:any)=> state.prood)
  return (
    <div className={styles.basket}>
        <div className={styles.basket_wrapper}>
            <div className={styles.basket_title}><span>Корзина:</span></div>
            {prood_basket.map((elem:any)=><CartProodBasket key={elem.id} elem={elem}/>)}
        </div>
    </div>
  )
}
