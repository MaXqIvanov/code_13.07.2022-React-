import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CartProodBasket } from '../components/BasketPage/CartProodBasket';
import styles from '../scss/BasketPage.module.scss';

export const BasketPage = () => {
  const dispatch = useDispatch()
  const nav = useNavigate();
  const {prood_basket} = useSelector((state:any)=> state.prood)
  const [orderPrice, setOrderPrice] = useState<number>(0)
  const [currentOrderPrice, setCurrentOrderPrice] = useState<number>(0)
  useEffect(() => {
    console.log("change prood_basket");
    setOrderPrice(prood_basket.reduce((sum:any, current:any)=>{
      if(current.cost_with_discount){
        return sum + current.cost_with_discount
      }else{
        return sum + current.cost
      }
    }, 0))
    setCurrentOrderPrice(prood_basket.reduce((sum:any, current:any)=>{
      return sum + current.cost
    }, 0))
  }, [prood_basket])

  return (
    <div className={styles.basket}>
        <div className={styles.basket_wrapper}>
          <div className={styles.basket_info}>
           <div className={styles.basket_title}><span>Корзина:</span></div>
            {prood_basket.map((elem:any)=><CartProodBasket key={elem.id} elem={elem}/>)}
          </div>
          <div className={styles.basket_orders}>
            <div className={styles.basket_orders_wrapper}>
              <div className={styles.block_order}>
                <div className={styles.block_order_title}>Сумма заказа: </div>
                <div className={styles.block_order_cost}>
                  <div>Стоимость</div>
                  <div className={styles.not_sale}>{currentOrderPrice.toFixed(1)} ₽</div>
                </div>
                <div className={styles.separate_line}></div>
                <div className={styles.block_order_all_cost}>
                  <div>Цена со скидкой</div>
                  <div>{orderPrice.toFixed(1)} ₽</div> 
                </div>
                <div onClick={()=>nav('/orders')} className={styles.block_order_btn}>Оформить заказ</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
