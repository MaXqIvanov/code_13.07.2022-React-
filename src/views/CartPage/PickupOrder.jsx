import React, {useEffect, useState} from 'react';
import {Button, Card, FloatingLabel, Form, ListGroup, Modal, Offcanvas} from "react-bootstrap";
import styles from "./CartPage.module.css";
import stylez from './PirckupOrder.module.css'
import Map, {Marker, GeolocateControl, NavigationControl} from "react-map-gl";
import api from "../../plugins/axios/api";
import {useCookies} from "react-cookie";
import cart from "../../store/cart";

const PickupOrder = (props) => {
    const [token, setToken] = useState('pk.eyJ1IjoiZGllbGl0IiwiYSI6ImNreGJ3b3RlOTByOHQycHE5bWwzaXlxZ2cifQ.1QkwgR8DegdGymUZL3iTjg')
    const [selectedCoord, setSelectedCoord] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showPopup, setShowPopup] = useState(false);
    const [showMoreItems, setShowMoreItems] = useState(false);
    const [addressModalStatus, setAddressModalStatus] = useState(false)
    const [pickupTypes, setPickupTypes] = useState([...props.pickupData,{...props.pickupData[0],pickup_type:'Выбор точек' ,type:{...props.pickupData[0].type, url:'custom_pickup'}}])
    let [choosenType, setChoosenType] = useState(props.pickupData[0])
    const [cookies] = useCookies(['userCity']);
    const [shopAddresses, setShopAddresses] = useState([])
    const [selectedShop,setSelectedShop] = useState(null)
    let [commentHolder, setCommentHolder] = useState('')
    let [phoneHolder, setPhoneHolder] = useState('')
    const [moreInShop, setMoreInShop] = useState([])
    const [moreItems,setMoreItems] = useState([])


    const handleModalClose = () => setAddressModalStatus(false);
    const handleModalOpen = (item) => setSelectedItem(item)
    const handleCanvasClose = () => {
        setShowMoreItems(false)
        setMoreItems([])
    }
    const handleCanvasOpen = () => setShowMoreItems(true)

    useEffect(()=>{
        if (selectedShop !== null){
            getMorePosInShop()
        }
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
    async function openMoreItems(){
        handleCanvasOpen(true)
        }
        async function addMoreToCart(item){
        if (moreItems.includes(item)){return}
        setMoreItems((prevState)=>[...prevState,item])
        }
        useEffect(()=>{
            console.log(moreItems)
        },[moreItems])


    function requesAddToCartMore() {
        let result = choosenType
        for (let i = 0; i < result.cart.length; i++){
            if (result.cart[i].id === selectedItem.id){
                result.cart[i].shop = selectedShop.id
                result.cart[i].shop_address = selectedShop
            }
            for (let j=0; j < moreItems.length; j++){
                if (result.cart[i].id === moreItems[j].id ){
                    result.cart[i] = moreItems[j]
                    result.cart[i].shop = selectedShop.id
                    result.cart[i].shop_address = selectedShop
                }
            }
        }
        api.post('marketplace/order/pickup_custom_price/', {
            cart:
                 choosenType.cart.map((item) => {
                             return {id: item.id, shop: item.shop}
                     })
        })
            .then((response) => {
                setChoosenType((prevState) => ({
                    ...prevState,
                    cost: response.data.cost,
                    delivery_date: response.data.delivery_date,
                    cart: response.data.cart
                }))
            })
            .finally(()=>{
                handleCanvasClose()
                handleModalClose()
            })

        //
        //          choosenType.cart.map((item) => {
        //             if (item.id  === selectedItem.id) {
        //                 return {id: item.id, shop: selectedShop.id}
        //             }
        //             else {
        //                 return item
        //             }
        //         }
        //         )
        // })

    }

    function requesAddToCart() {
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



    function getMorePosInShop(){
        api(`marketplace/cart/get_by_shop/?shop=${selectedShop.id}&ex=${selectedItem.id}`)
            .then((response)=>{
                setMoreInShop(response.data)
            })
    }
    useEffect(()=>{
        if (choosenType.pickup_type === "Выбор точек") {
            console.log(choosenType)
        }
    },[choosenType.cart])

     function createPickupOrder(e){
        e.preventDefault()
        if (choosenType.pickup_type === 'Выбор точек'){
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
                        props.setOrderId(response.data.id)
                        props.handlePickupClose()
                        props.handleSuccessShow(response.data.id)
                    }
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
                .then((response) =>{
                    if (response.status === 200){
                        props.setOrderId(response.data.id)
                        props.handlePickupClose()
                        props.handleSuccessShow(response.data.id)
                    }
                })
        }
    }
    let pins = shopAddresses.map((shop) => (
                <Marker
                    key={shop.id}
                    longitude={shop.longitude}
                    latitude={shop.latitude}
                    color={shop === selectedShop ? 'red' : ''}
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
                            onChange={()=>{
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
                                    <span className={styles.itemPrice}> {item.cost} руб.</span>
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
                <Button onClick={()=>{props.handlePickupClose()}} variant="secondary">Закрыть</Button>
                <Button type={'submit'} variant="primary">Добавить</Button>
            </Modal.Footer>
            </form>
        </Modal>
    <Modal size={'lg'} show={addressModalStatus && !showMoreItems} onHide={handleModalClose}>
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
                        zoom: 9
                    }}
                    style={{width: '100%', height: 400}}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                    {selectedShop !== null &&
                    <div className={stylez.controlPanel}>

                        <span><b>Выбранный адрес:</b> {selectedShop?.address}</span>
                        <span>{selectedShop.description}</span>
                    </div>
                    }
                    <GeolocateControl />
                    <NavigationControl></NavigationControl>
                    {pins}
                    
                </Map>
            }
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary">Закрыть</Button>
            <Button onClick={
                openMoreItems
            } variant="primary">Добавить</Button>
        </Modal.Footer>
    </Modal>
            <Offcanvas style={{zIndex:10000, width:'40%'}} show={showMoreItems} onHide={handleCanvasClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Больше доступных позиций в магазине</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ListGroup>
                        {moreInShop.map((item, index)=>(
                            <ListGroup.Item key={index} className={stylez.itemBlockMore}>
                                <div className={stylez.itemImgBlockMore} >
                                    <img className={stylez.itemImgMore} src={item.images[0]} alt=""/>
                                </div>
                                <div className={stylez.itemInfoMore}>
                                    <span>{item._nomenclature.name}</span>
                                </div>
                                <Button onClick={()=>{addMoreToCart(item)}}>Выбрать</Button>
                            </ListGroup.Item>
                        ))}

                    </ListGroup>
                </Offcanvas.Body>
                <Button onClick={requesAddToCartMore}  style={{margin:4}} >Готово</Button>
            </Offcanvas>
    </div>
    );
};

export default PickupOrder;
