import React, {useEffect, useState} from 'react';
import {Card, ListGroup, Badge} from "react-bootstrap";
import api from "../../plugins/axios/api";
import styles from './OrderListPage.module.css'
import {useNavigate} from "react-router-dom";

const OrderListPage = () => {
const [ordersList, setOrdersList] = useState([])
    let navigate = useNavigate()
    useEffect(() => {
       api('marketplace/order/')
           .then((response)=>{
               setOrdersList(response.data.results)
           })
    }, []);


    return (
        <Card>
            <Card.Header>
                <Card.Title>Мои заказы</Card.Title>
            </Card.Header>
            <Card.Body>
                <ListGroup>
                    {ordersList.map((order)=>(
                        <ListGroup.Item onClick={()=>{
                            navigate(`/order/${order.id}`)
                        }} className={styles.orderItem}>
                            <div className={styles.mainOrderBlock}>
                                <span className={styles.orderId}>Заказ #{order.id}</span>
                                <div className={styles.imgBlock}>
                                    {order.images.map((img)=>(
                                        <img className={styles.orderImg} src={img} alt=""/>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                Время: {order.est_time}
                            </div>
                            <div className={styles.secondOrderBlock}>
                                <Badge className={styles.orderStatus} bg="secondary">{order.status}</Badge>
                            </div>

                        </ListGroup.Item>
                        )
                    )}

                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default OrderListPage;
