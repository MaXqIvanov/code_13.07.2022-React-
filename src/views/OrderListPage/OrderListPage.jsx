import React, {useEffect, useState} from 'react';
import {Card, ListGroup, Badge, Pagination, Button} from "react-bootstrap";
import api from "../../plugins/axios/api";
import styles from './OrderListPage.module.css'
import {useNavigate} from "react-router-dom";
import axios from "axios";


const OrderListPage = () => {
const [ordersList, setOrdersList] = useState([])
    const [pagesTotal,setPagesTotal] = useState(null)
    const [nextPage,setNextPage] = useState(null)
    let navigate = useNavigate()
    useEffect(() => {
       api('marketplace/order/')
           .then((response)=>{
               setPagesTotal(response.data.count)
               setNextPage(response.data.next)
               setOrdersList(response.data.results)
           })
    }, []);
function fetchData() {
    let parsedNext = nextPage.split('')
    console.log(parsedNext)
    api(`marketplace/order/?page=${parsedNext[parsedNext.length - 1]}`)
        .then((response)=>{
            setPagesTotal(response.data.count)
            setNextPage(response.data.next)
            console.log([...ordersList, ...response.data.results])
            setOrdersList([...ordersList, ...response.data.results])
        })
}


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
                                <span><b>Время:</b> {order.est_time}</span>
                                <span><b>Тип:</b> {order.pickup ? 'Самовывоз' : 'Доставка'}</span>
                            </div>
                            <div className={styles.secondOrderBlock}>
                                <Badge className={styles.orderStatus} bg="secondary">{order.status}</Badge>
                            </div>

                        </ListGroup.Item>
                        )
                    )}

                </ListGroup>
                <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                    {nextPage &&
                        <Button onClick={fetchData} className={'mt-2'} style={{width: '30%'}}>Ещё</Button>
                    }
                </div>

            </Card.Body>
        </Card>
    );
};

export default OrderListPage;
