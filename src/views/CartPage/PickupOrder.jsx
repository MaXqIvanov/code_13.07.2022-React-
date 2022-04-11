import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, FloatingLabel, Form, ListGroup, Modal} from "react-bootstrap";
import styles from "./CartPage.module.css";
import stylez from './PirckupOrder.module.css'
import DatePicker from "react-datepicker";
import Map, {Marker, GeolocateControl, NavigationControl,AttributionControl} from "react-map-gl";
import api from "../../plugins/axios/api";
import {useCookies} from "react-cookie";
import {Pin} from "react-bootstrap-icons";




const PickupOrder = (props) => {
    const [token, setToken] = useState('pk.eyJ1IjoiZGllbGl0IiwiYSI6ImNreGJ3b3RlOTByOHQycHE5bWwzaXlxZ2cifQ.1QkwgR8DegdGymUZL3iTjg')
    const [selectedCoord, setSelectedCoord] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showPopup, setShowPopup] = useState(false);
    let [addressModalStatus, setAddressModalStatus] = useState(false)
    let [pickupTypes, setPickupTypes] = useState(props.pickupData)
    let [choosenType, setChoosenType] = useState(props.pickupData[0])
    const [cookies] = useCookies(['userCity']);
    let [shopAddresses, setShopAddresses] = useState([])
    let [selectedShop,setSelectedShop] = useState(null)


    const handleModalClose = () => setAddressModalStatus(false);
    const handleModalOpen = async (item) => {
       await setSelectedItem(item)
    }
    useEffect(()=>{
    },[selectedShop])
    useEffect(()=>{

    },[showPopup])

    useEffect(()=>{
if(selectedItem == null){ return}
        api(`marketplace/shop/get_similar/?cart_position=${selectedItem.id}&city=${cookies.userCity.id}`)
            .then((response)=>{
                setShopAddresses(response.data)
            })
            .finally(()=>{
                setAddressModalStatus(true)
            })
        setSelectedShop(selectedItem._shop)
        console.log(selectedShop)

    },[selectedItem])

    function selectShop(shop) {
        console.log(selectedShop)
        setSelectedShop(shop)
        console.log(selectedShop)
    }
    async function addToCustomCart(){
        console.log(choosenType)
        console.log(selectedItem)
        setChoosenType({...choosenType, cart:[choosenType.cart.map((item)=>
           item.id === selectedItem.id ? selectedItem : item
            )]})
    }
    const pins = shopAddresses.map((shop) => (
                <Marker
                    key={shop.id}
                    longitude={shop.longitude}
                    latitude={shop.latitude}
                    anchor="bottom"
                    onClick={()=>{selectShop(shop)}}
                >
                </Marker>
            ))


    return (
        <div>
        <Modal  size={'xl'} show={addressModalStatus ? false : true} onHide={props.handlePickupClose}>
            <Modal.Header closeButton>
                <Modal.Title>Итог</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {
                    pickupTypes.map((item) => (
                        <Form.Check
                            key={item.name}
                            type={"radio"}
                            onClick={()=>{
                                setChoosenType(item)
                            }}
                            checked={choosenType === item ? true : false}
                            label={ `${item.pickup_type} (${item.delivery_date}) ` }
                        />
                    ))
                }
                <Card>
                    <ListGroup className={styles.finishCartList}>
                        {choosenType.cart.map((item)=>(
                            <ListGroup.Item key={item.id} className={styles.finishCartBlock}>
                                <div className={styles.itemImgBlock}>
                                    <img className={styles.itemImg} src={item.images[0]} alt="Фото товара"/>
                                    <span className={styles.itemCode}>Код товара: {item.id}</span>
                                </div>

                                <div className={styles.finishItemName}>
                                    {item._nomenclature.name}
                                    <br/>
                                    <b>{item.shop_address.address}</b> <span className={stylez.changeAddress} onClick={()=>{handleModalOpen(item)}}>Изменить адресс</span>
                                </div>
                                <span className={styles.itemPrice}> {item.middle_cost} руб.</span>
                            </ListGroup.Item>
                        ))}


                    </ListGroup>
                    <div className={styles.finishPricesBlock}>
                        <p className={'mt-2'} style={{fontSize:'1.5rem', fontWeight:'bolder'}}>Итого: {choosenType.cost} руб.</p>
                    </div>
                </Card>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary">Закрыть</Button>
                <Button  variant="primary">Добавить</Button>
            </Modal.Footer>




        </Modal>
    <Modal size={'lg'} show={addressModalStatus} onHide={handleModalClose}>
        <Modal.Header closeButton>
            <Modal.Title>Итог</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {selectedItem !== null &&
                <Map
                    styleDiffing
                    initialViewState={{
                        longitude: selectedItem.shop_address.longitude,
                        latitude: selectedItem.shop_address.latitude,
                        zoom: 14
                    }}
                    style={{width: '100%', height: 400}}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                    {selectedShop !== null &&
                    <div className={stylez.controlPanel}>
                        <span>Выбранный адрес: {selectedShop.address}</span>
                    </div>
                    }

                    <GeolocateControl />
                    <NavigationControl></NavigationControl>

                    {pins}

                    }
                </Map>
            }
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary">Закрыть</Button>
            <Button onClick={
                addToCustomCart
            } variant="primary">Добавить</Button>
        </Modal.Footer>
    </Modal>
    </div>
    );
};

export default PickupOrder;
