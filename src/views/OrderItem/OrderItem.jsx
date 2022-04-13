import React, {useEffect, useState} from 'react';
import {Card} from "react-bootstrap";
import {useParams} from "react-router-dom";
import api from "../../plugins/axios/api";

const OrderItem = () => {
    const [orderInfo,setOrderInfo] = useState()
    const urlParams = useParams()
    useEffect(()=>{
        api(`marketplace/order/${urlParams.id}/`)
            .then((response)=>{
                setOrderInfo(response.data)
            })
    },[])
    return (
        <Card>
            <Card.Header>
                <Card.Title>Заказ #{urlParams.id}</Card.Title>
            </Card.Header>
            <Card.Body>
                <div>
                    <p>Статус: {urlParams.status}</p>
                </div>
            </Card.Body>
        </Card>
    );
};

export default OrderItem;
