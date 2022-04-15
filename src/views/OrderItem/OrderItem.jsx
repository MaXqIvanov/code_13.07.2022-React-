import React, {useEffect, useState} from 'react';
import {Badge, Card} from "react-bootstrap";
import {useParams} from "react-router-dom";
import api from "../../plugins/axios/api";
import styles from './OrderItem.module.css'

const OrderItem = () => {
    const [orderInfo,setOrderInfo] = useState({})
    const [orderPositions,setOrderPositions] = useState({})
    const [isLoading,setIsLoading] = useState(false)
    const urlParams = useParams()
    useEffect(()=>{
        setIsLoading(true)
        api(`marketplace/order/${urlParams.id}/`)
            .then((response)=>{
                setOrderInfo(response.data)
            })
            .finally(()=>{
                setIsLoading(false)
            })
        api(`marketplace/order/3/get_order_positions/`)
            .then((response)=>{
                setOrderPositions(response.data)
            })
        {}
    },[])
    return (
        <Card>
            {!isLoading &&
                <div>
            <Card.Header>
                <Card.Title>Заказ #{urlParams.id}</Card.Title>
            </Card.Header>
            <Card.Body>
                <div className={styles.infoBlock}>
                <div>
                    <p><b>Статус: </b> <Badge  bg="secondary">{orderInfo.status}</Badge></p>
                    <p><b>Время:</b> {orderInfo.est_time}</p>
                    <p><b>Комментарий:</b> {orderInfo.comment}</p>
                </div>
                <div>
                    <p><b>Менеджер:</b> {orderInfo.manager_phone}</p>
                    <p><b>Стоимость:</b> {orderInfo.cost} руб.</p>
                    <p><b>Тип:</b> {orderInfo.pickup === false && 'Доставка'} {orderInfo.pickup === true && 'Самовывоз'}</p>
                </div>
                </div>
            </Card.Body>
                </div>
            }
            {isLoading &&
                <Card></Card>
            }
        </Card>
    );
};

export default OrderItem;
