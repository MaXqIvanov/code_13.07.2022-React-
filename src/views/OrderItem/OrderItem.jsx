import React, {useEffect, useState} from 'react';
import {Badge, Button, Card, ListGroup} from "react-bootstrap";
import {useParams} from "react-router-dom";
import api from "../../plugins/axios/api";
import styles from './OrderItem.module.css'
import OrderMap from "../../components/OrderMap/OrderMap";

const OrderItem = () => {
    const [orderInfo,setOrderInfo] = useState({})
    const [orderPositions,setOrderPositions] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const urlParams = useParams()

    const handleMapClose = () => { setShowMap(false) }
    useEffect(()=>{
        setIsLoading(true)
        api(`marketplace/order/${urlParams.id}/`)
            .then((response)=>{
                setOrderInfo(response.data)
            })
            .finally(()=>{
                setIsLoading(false)
            })
        api(`marketplace/order/${urlParams.id}/get_order_positions/`)
            .then((response)=>{
                setOrderPositions(response.data)
            })
        {}
    },[])
    async function selectItem(item){
        await setSelectedItem(item)
        await setShowMap(true)
    }

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
            {!isLoading &&
                <Card>
                    <ListGroup className={styles.finishCartList}>
                        {orderPositions.map((item) => (
                            <ListGroup.Item className={styles.finishCartBlock}>
                                <div className={styles.itemImgBlock}>
                                    <img className={styles.itemImg} src={item.nomenclature.images[0]}
                                         alt="Фото товара"/>
                                    <span className={styles.itemCode}>Код товара: {item.id}</span>
                                </div>

                                <div
                                    className={styles.finishItemName}>
                                    <span>{item.nomenclature.name}</span>
                                    {orderInfo.pickup &&
                                        <span><b>Адрес: {item.shop_address.address}</b></span>
                                    }
                                </div>
                                <div className={'flex-column d-flex align-items-center gap-1'}>
                                <span className={styles.itemPrice}>{item.count} {item.nomenclature._measurement.code} x {item.cost} руб.</span>
                                    {orderInfo.pickup === true &&
                                        <Button onClick={() => {
                                            selectItem(item)
                                        }} variant={'primary'}>Посмотреть на карте</Button>
                                    }
                                </div>
                            </ListGroup.Item>
                            ))}
                    </ListGroup>

                </Card>
            }
            {showMap &&
                <OrderMap handleMapClose={handleMapClose} orderInfo={selectedItem.shop_address}></OrderMap>
            }
        </Card>
    );
};

export default OrderItem;
