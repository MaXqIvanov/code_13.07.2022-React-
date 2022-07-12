import React from 'react'
import { useSelector } from 'react-redux';
import styles from '../../scss/OrdersPage.module.scss';

export const CartOrders = ({orders}:any) => {
  const {orders_prood} = useSelector((state:any)=> state.order)
  return (
    <div className={styles.cart_orders}>
        <div className={styles.cart_orders_wrapper}>
            <div className={styles.cart_orders_store_name}>Магазин: <span>{orders.store_name}</span></div>
            <div></div>
        </div>
    </div>
  )
}
