import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, FloatingLabel, Form, ListGroup, Modal} from "react-bootstrap";
import styles from "./CartPage.module.css";
import stylez from './PirckupOrder.module.css'
import DatePicker from "react-datepicker";
import Map, {Marker, GeolocateControl, NavigationControl} from "react-map-gl";
import api from "../../plugins/axios/api";
import {useCookies} from "react-cookie";
import SuccessOrder from "../../components/SuccessOrder/SuccessOrder";
import cart from "../../store/cart";




const PickupOrder = (props) => {
    const [token, setToken] = useState('pk.eyJ1IjoiZGllbGl0IiwiYSI6ImNreGJ3b3RlOTByOHQycHE5bWwzaXlxZ2cifQ.1QkwgR8DegdGymUZL3iTjg')
    const [selectedCoord, setSelectedCoord] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showPopup, setShowPopup] = useState(false);
    const [addressModalStatus, setAddressModalStatus] = useState(false)
    const [pickupTypes, setPickupTypes] = useState([...props.pickupData,{...props.pickupData[0],pickup_type:'Выбор точек' ,type:{...props.pickupData[0].type, url:'custom_pickup'}}])
    let [choosenType, setChoosenType] = useState(props.pickupData[0])
    const [cookies] = useCookies(['userCity']);
    const [shopAddresses, setShopAddresses] = useState([])
    const [selectedShop,setSelectedShop] = useState(null)
    let [commentHolder, setCommentHolder] = useState('')
    let [phoneHolder, setPhoneHolder] = useState('')


    const handleModalClose = () => setAddressModalStatus(false);
    const handleModalOpen = (item) => setSelectedItem(item)

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
    },[selectedItem])

    function selectShop(shop) {
        setSelectedShop(shop)
    }
    async function addToCustomCart(){
console.log(selectedShop)
         setChoosenType({...choosenType, cart: choosenType.cart.map((item,index)=>
            item.id === selectedItem.id ? {...item, shop_address:selectedShop} : item
            )
        })
        console.log(choosenType)
        console.log(selectedItem)

            api.post('marketplace/order/pickup_custom_price/', {
                cart:
                    choosenType.cart.map((item) => {
                            if (item.id === selectedItem.id) {
                                return {id: item.id, shop: selectedShop.id}
                            }
                            else {
                                return item


                            }
                        }
                    )
            })
                .then((response) => {
                    setChoosenType((prevState) => ({
                        ...prevState,
                        cost: response.data.cost,
                        delivery_date: response.data.delivery_date,
                        cart: response.data.cart
                    }))
                })



        handleModalClose()
    }
    useEffect(()=>{
        if (choosenType.pickup_type === "Выбор точек") {
            console.log(choosenType)
        }
    },[choosenType.cart])

     function createPickupOrder(e){
        e.preventDefault()
        if (choosenType.pickup_type=== 'Выбор точек'){
            api.post(`marketplace/order/pickup_custom/`,{
                phone:phoneHolder,
                est_time:choosenType.delivery_date + ' 14:30',
                payment_method:'card',
                comment:commentHolder,
                cost:choosenType.cost,
                delivery_date:choosenType.delivery_date,
                cart: [...choosenType.cart]
            })
                .then(response =>{
                    if (response.status === 200){
                        console.log(response.data.id)
                        props.setOrderId(response.data.id)
                        props.handlePickupClose()
                    }
                })
                .then((response)=>{
                    props.handleSuccessShow(response.data.id)
                })
                .finally(()=>{
                    cart.requestInfo()
                })

        } else {
            api.post(`marketplace/order/${choosenType.type.url}/?city=${cookies.userCity.id}&address=${props.chosenAddress}`,{
                phone:phoneHolder,
                est_time: choosenType.delivery_date + ' 14:30',
                payment_method:'card',
                comment:commentHolder,
                card: [...choosenType.cart]

            })
                .then(response =>{
                    if (response.status === 200){
                        props.handlePickupClose()
                        props.handleSuccessShow(response.data.id)
                    }
                })
        }
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
            <form onSubmit={(e)=>{createPickupOrder(e)}}>
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
                            checked={choosenType.pickup_type === item.pickup_type ? true : false}
                            label={ `${item.pickup_type} (${item.delivery_date}) ` }
                        />
                    ))
                }

                <Card>
                        <ListGroup className={styles.finishCartList}>
                            {choosenType.cart.map((item) => (
                                <ListGroup.Item key={item.id} className={styles.finishCartBlock}>
                                    <div className={styles.itemImgBlock}>
                                        <img className={styles.itemImg} src={item.images[0]} alt="Фото товара"/>
                                        <span className={styles.itemCode}>Код товара: {item.id}</span>
                                    </div>

                                    <div className={styles.finishItemName}>
                                        {item._nomenclature.name}
                                        <br/>
                                        <b>{item.shop_address.address}</b>
                                        {choosenType.type.url === 'custom_pickup' &&
                                            <span className={stylez.changeAddress}
                                                  onClick={() => {
                                                      handleModalOpen(item)
                                                  }}> Изменить адрес</span>
                                        }
                                    </div>
                                    <span className={styles.itemPrice}> {item.middle_cost} руб.</span>
                                </ListGroup.Item>

                            ))}
                        </ListGroup>
                    <div className={styles.finishPricesBlock}>
                        <p className={'mt-2'} style={{fontSize:'1.5rem', fontWeight:'bolder'}}>Итого: {choosenType.cost} руб.</p>
                    </div>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Номер телефона"
                        className="mt-2"
                    >
                        <Form.Control onChange={(e)=>{
                            setPhoneHolder(e.target.value)}
                        } required type="tel" placeholder="+7 (___)___ -__-__" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingTextarea2" label="Комментарий к заказу (дополнительно)">
                        <Form.Control
                            as="textarea"
                            onChange={(event)=>{
                                setCommentHolder(event.target.value)
                            }
                            }
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                            className={'mt-2'}
                        />
                    </FloatingLabel>
                </Card>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary">Закрыть</Button>
                <Button type={'submit'} variant="primary">Добавить</Button>
            </Modal.Footer>
            </form>
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

                        <span><b>Выбранный адрес:</b> {selectedShop.address}</span>
                        <span>{selectedShop.description}</span>
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
