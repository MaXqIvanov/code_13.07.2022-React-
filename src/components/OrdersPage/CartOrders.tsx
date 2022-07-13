import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../scss/OrdersPage.module.scss';
import { addOrders } from '../../store/orderSlice';

export const CartOrders = ({orders}:any) => {
    console.log(orders);
    const dispatch = useDispatch();
    const [activeOrder, setActiveOrder] = useState(false);
    const {orders_add_prood} = useSelector((state:any)=> state.order);
    useEffect(() => {
        let check = orders_add_prood.filter((elem:any)=> elem.store_id === orders.store_id)
        if(check.length > 0){
            setActiveOrder(true)
        }else{
            setActiveOrder(false)
        }
    }, [orders_add_prood])
    
  return (
    <div className={styles.cart_orders}>
        <div className={`${styles.cart_orders_wrapper} ${activeOrder && styles.active_order}`}>
            <div className={styles.cart_orders_store_name}>
                <Form.Check
                    onClick={(e:any)=>dispatch(addOrders({orders, checked: e.target.checked}))}
                    type='checkbox'
                    checked={activeOrder}
                    id={`default-${orders.store_id}`}
                />
                 Магазин: {orders.store_name}
            </div>
            <div className={styles.cart_orders_info}>
                {
                    orders.cart_positions.map((elem:any)=>
                    <div key={elem.id} className={styles.current_order}>
                        <div className={styles.current_order_wrapper}>
                            <div style={{backgroundImage: `url(${elem._product.photos[0]})`}} className={styles.current_order_img}></div>
                            <div className={styles.current_order_group}>
                                <div className={styles.current_order_name}>{elem._product.name}</div>
                                <div className={styles.group_cost}>
                                    {elem.cost_with_discount ? <div className={styles.current_order_discount_price}>{elem.cost} ₽</div> : <></>}
                                    <div className={styles.current_order_price}>{elem.cost_with_discount ? elem.cost_with_discount : elem.cost} ₽</div>
                                    <div className={styles.current_order_count}>количество: {elem.count}</div>
                                </div>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    </div>
  )
}
