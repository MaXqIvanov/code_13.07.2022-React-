import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrdersAddressAsync, getOrdersAsync } from '../store/orderSlice'
import styles from '../scss/OrdersPage.module.scss';
import { CartOrders } from '../components/OrdersPage/CartOrders';
import { ModalAddressAdded } from '../components/OrdersPage/ModalAddressAdded';

export const OrdersPage = () => {
    const dispatch = useDispatch()
    const {orders_prood, orders_add_prood, orders_address} = useSelector((state:any)=> state.order)
    const [visibleAddress,setVisibleAddress] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0)
    useEffect(() => {
        dispatch(getOrdersAsync())
        dispatch(getOrdersAddressAsync())
      }, [])
    
    useEffect(() => {
        setTotalPrice(orders_add_prood.reduce((sum:any, currentPrice:any)=>{return sum + currentPrice.amount_with_discount}, 0))
    }, [orders_add_prood])
      
  return (
    <div className={styles.orders}>
        <div className={styles.orders_wrapper}>
            <div className={styles.block_inform}>
                <div className={styles.order_address_user}>
                    <div className={styles.order_address_title}>Адрес доставки</div>
                    <div className={styles.order_address_info}>
                        {orders_address ? orders_address.map((elem:any)=> <div>
                            какой то адресс (изменить)
                        </div>) : <></>}
                        <div onClick={()=>setVisibleAddress(!visibleAddress)} className={styles.order_address_btn}>+добавить новый адрес</div>
                    </div>
                </div>
                <div className={styles.orders_info}>
                    <div className={styles.title_order}>Состав заказа</div>
                    {orders_prood.map((elem:any)=><CartOrders orders={elem} key={elem.store_id}/>)}
                </div>
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
        {visibleAddress && <ModalAddressAdded setVisibleAddress={setVisibleAddress}/> }
    </div>
  )
}
