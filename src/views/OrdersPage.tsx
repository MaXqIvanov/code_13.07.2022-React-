import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrdersAsync } from '../store/orderSlice'
import styles from '../scss/OrdersPage.module.scss';
import { CartOrders } from '../components/OrdersPage/CartOrders';

export const OrdersPage = () => {
    const dispatch = useDispatch()
    const {orders_prood, orders_add_prood} = useSelector((state:any)=> state.order)
    const [totalPrice, setTotalPrice] = useState(0)
    useEffect(() => {
        dispatch(getOrdersAsync())
      }, [])
    
    useEffect(() => {
        setTotalPrice(orders_add_prood.reduce((sum:any, currentPrice:any)=>{return sum + currentPrice.amount_with_discount}, 0))
    }, [orders_add_prood])
      
      
  return (
    <div className={styles.orders}>
        <div className={styles.orders_wrapper}>
            <div className={styles.orders_info}>
                <div className={styles.title_order}>Состав заказа</div>
                {orders_prood.map((elem:any)=><CartOrders orders={elem} key={elem.store_id}/>)}
            </div>
            <div className={styles.orders_send}>
                <div className={styles.orders_send_wrapper}>
                    <div className={styles.orders_block}>
                        <div className={styles.orders_send_title}>Сумма заказа</div>
                        <div className={styles.orders_send_price}>
                            <div>к оплате</div>
                            <div>{totalPrice} ₽</div>
                        </div>
                        <div className={styles.orders_send_btn}>Подтвердить заказ</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
