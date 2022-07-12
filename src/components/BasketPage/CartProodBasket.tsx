import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import styles from '../../scss/BasketPage.module.scss';
import { changeProodBasketAsync, deleteProodBasketAsync, getProodBasketAsync } from '../../store/proodSlice';

export const CartProodBasket = ({elem}:any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProodBasketAsync())
  }, [])
  
  return (
    <div className={styles.cart_basket}>
        <div className={styles.cart_basket_wrapper}>
          <div style={{backgroundImage: `url(${elem._product?.photos[0]})`}} className={styles.basket_img}></div>
          <div className={styles.block_info_basket}>
            <div className={styles.basket_code}>Код товара: {elem?._product?.code}</div>
            <div className={styles.basket_name}>{elem?._product?.name}</div>
            <div className={`${styles.group_price}`}>
              <div className={styles.group_price_wrapper}>
                <div className={styles.basket_price}>{elem?.cost_with_discount ? elem?.cost_with_discount.toFixed(1) : elem?.cost.toFixed(1)} <span>₽</span></div>
                {elem.cost_with_discount ? <div className={styles.cost_discount}>{elem?.cost.toFixed(1)} <span>₽</span></div> : <></>}
              </div>
            </div>
            <div className={styles.basket_count}>В наличии {elem?._product?.count}</div>
            <div className={styles.basket_description}>Описание : {elem?._product?.description}</div>
            <div className={styles.block_with_btn}>
              <i onClick={()=>dispatch(changeProodBasketAsync({amount: -1, elem}))} className={`bi bi-dash ${styles.basket_minus}`}></i>
              <div className={styles.basket_amount}>{elem?.count}</div>
              <i onClick={()=>dispatch(changeProodBasketAsync({amount: 1, elem}))} className={`bi bi-plus ${styles.basket_plus}`}></i>
            </div>
            <i onClick={()=>dispatch(deleteProodBasketAsync({id: elem.product}))} title='Удалить товар из корзины' className={`bi bi-trash3-fill ${styles.basket_delete}`}></i>
          </div>
        </div>
    </div>
  )
}
