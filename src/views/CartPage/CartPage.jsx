import React, {useEffect, useState} from 'react';
import styles from './CartPage.module.css'

import {
    Card,
    ListGroup,
    Button,
    InputGroup,
    FormControl,
    Form,
    Tab,
    Nav,
    Col,
    Row,
    Modal,
    FloatingLabel
} from "react-bootstrap";
import api from "../../plugins/axios/api";

import DeliveryMap from "../../components/DeliveryMap/DeliveryMap";
import {useCookies} from "react-cookie";
import DatePicker from 'react-datepicker'
import user from "../../store/user";
import cart from "../../store/cart";
import PickupOrder from "./PickupOrder";
import {useNavigate} from "react-router-dom";
import SuccessOrder from "../../components/SuccessOrder/SuccessOrder";


const CartPage = () => {
    const [cookies] = useCookies(['userCity']);
    let [cartHolder, setCardHolder] = useState([])
    let [amountHolder, setAmountHolder] = useState(null)
    let [isLoading,setIsLoading] = useState(true)
    let [typesIsLoading, setTypesIsLoading] = useState(true)
    let [commentHolder, setCommentHolder] = useState('')
    let [phonetHolder, setPhoneHolder] = useState('')
    let [addressHolder,setAddressHolder] = useState([])
    let [chosenAddress,setChosenAddress] = useState(null)
    const [addressShow, setAddressShow] = useState(false);
    const  [navStatus,setNavStatus] = useState('delivery')
    let [newAddress,setNewAddress] = useState(null)
    const [showCount, setCountShow] = useState(false);
    let [deliveryTypes, setDeliveryTypes] = useState([])
    let [pickupTypes, setPickupTypes] = useState([])
    let [choosenType, setChoosenType] = useState([])
    let [choosenPickupType, setChoosenPickupType] = useState([])
    const [startDate, setStartDate] = useState('');
    let [pickupModalHolder, setPickupModalHolder] = useState(false)
    const [successModal, setSuccessModal] = useState(false)
    const [orderNumber, setOrderNumber] = useState(null)
    const [cartIsEmpry, setCartIsEmpry] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        if (cartHolder.length === 0 && isLoading === false){
            navigate('/')
        }
    },[cartHolder])


    const handleSuccessShow = (orderNumber) => {
        setOrderNumber(orderNumber)
        setSuccessModal(true)
    };
    const handleSuccessHide = (orderNumber) => {
        setSuccessModal(false)
    };

    const handleCountClose = () => setCountShow(false);
    const handleCountShow =  () => {
        if (navStatus === 'delivery') {
            deliveryTypes.length === 0
                ?
                api(`marketplace/order/delivery_all/?city=${cookies.userCity.id}&address=${chosenAddress}`)
                    .then((response) => {
                        setDeliveryTypes(response.data)
                        setChoosenType(response.data[0])
                        console.log(deliveryTypes)
                    })
                    .finally(() => {
                        setTypesIsLoading(false)

                        console.log(choosenType)
                        setCountShow(true)
                    })
                :
                setCountShow(true)
        }
        if (navStatus === 'pickup'){
            api(`marketplace/order/pickup_all/?city=${cookies.userCity.id}&address=${chosenAddress}`)
                .then((response) => {
                    setPickupTypes(response.data)
                    setChoosenPickupType(response.data[0])
                })
                .finally(() => {

                    console.log(choosenType)
                    setPickupModalHolder(true)
                })
        }
    };

    const handleAddressClose = () => setAddressShow(false);
    const handleAddressShow = () => setAddressShow(true);



    function handlePickupClose(){
        setPickupModalHolder(false);
    }


    useEffect(()=>{
        api('marketplace/cart/')
            .then((response)=>{
                setCardHolder(response.data.result)
                setAmountHolder(response.data.amount)
            })
        api('marketplace/order-address/')
            .then((response)=>{
                setAddressHolder(response.data)
                if (response.data.length !== 0){
                    setChosenAddress(response.data[0].id)
                }
            })
            .finally(()=>{
                setIsLoading(false)
            })
    },[])
       function handleChanges(e,id,index) {
           setCardHolder(
              cartHolder.map((item) =>
                 item.id === id ? {...item, count: e.target.value} : item
             )

         )
         // sendChanges(id,index)
     }

     function takeAddressHandler(props){
        setNewAddress(props)
     }
     function addNewAddress(){
        api.post('marketplace/order-address/',newAddress)
            .then((response)=>{
                if (response.status === 201) {
                    setAddressHolder((prevState => ([...prevState,response.data])))
                    setAddressShow(false)
                }
            })
     }
      function deleteItemFromCart(index,id){

        api.delete(`marketplace/cart/${id}/`)
            .then((response)=>{
                if(response.status === 204) {
                    setCardHolder(cartHolder.filter((item,i) => index !== i))
                    cart.requestInfo()
                }
            })
            .finally(()=>{

            })
    }
    async function createDeliveryOrder(){
        api.post(`marketplace/order/${choosenType.type.url}/?city=${cookies.userCity.id}&address=${chosenAddress}`,{
            phone:phonetHolder,
            est_time: startDate.toLocaleString('ru',{year: 'numeric',month:'numeric', day:'numeric', hour:'numeric', minute:'numeric'}).split(',').join(''),
            payment_method:'card',
            comment:commentHolder
        })
            .then(response =>{
                console.log(response)
                if (response.status === 200){
                    handleCountClose()
                    handleSuccessShow(response.data.id)
                }
            })
    }

    //  useEffect(()=>{
    //      console.log(cartHolder)
    //  },[cartHolder])
    // //   function sendChanges(id, index){
    // //       api.post('marketplace/cart/change/',
    // //          {
    // //              nomenclature: id,
    // //              count: cartHolder[index].count
    // //          })
    // //  }
    // //
    // // function getValue(prop,id, event) { // получение значения свойства
    // //     return cartHolder.reduce(
    // //         (res, cart) => cart.id == id ? cart[prop] : res
    // //         , '');
    // // }
    return (
        <div className={styles.mainBlock}>
            {isLoading === false &&
                <div>
                <Card>
                    <Card.Title>Ваша корзина</Card.Title>
                    <Card.Body>
                        <ListGroup>
                            {cartHolder.map((item, index)=>(
                                <ListGroup.Item key={item.id} className={styles.listItem}>
                                    <div className={styles.itemImgBlock}>
                                    <img className={styles.itemImg} src={item.images[0]} alt="Фото товара"/>
                                        <span className={styles.itemCode}>Код товара: {item.id}</span>
                                    </div>

                                    <div className={styles.itemName}>{item._nomenclature.name}</div>

                                    <div className={styles.actionsBlock}>
                                        <span className={styles.itemPrice}>от {item.middle_cost} руб.</span>
                                        <InputGroup className={styles.changeCountAction} >
                                            <InputGroup.Text className={styles.countDecrementBtn} id="inputGroup-sizing-default">-</InputGroup.Text>
                                            <FormControl
                                                type={'number'}
                                                aria-label="Default"
                                                className={styles.countInput}
                                                onChange={(event)=>{
                                                    handleChanges(event,item.id,index)

                                                }}
                                                step="1"
                                                min="0"
                                                max="27"
                                                aria-describedby="inputGroup-sizing-default"
                                                value={item.count}
                                            />
                                            <InputGroup.Text className={styles.countIncrementBtn} id="inputGroup-sizing-default">+</InputGroup.Text>
                                        </InputGroup>
                                        <span onClick={()=>{deleteItemFromCart(index,item.id)}}  className={styles.actionsDeleteBtn}>Удалить</span>
                                    </div>
                                </ListGroup.Item>
                            ))}

                        </ListGroup>
                    </Card.Body>
                </Card>
                    {successModal &&
                        <SuccessOrder></SuccessOrder>
                    }


            <Card className={styles.cartSubmitBlock}>
                <Card.Title>Выберите способ получения</Card.Title>
                <Card.Body className={styles.cartDeliveryBody}>
                    <Tab.Container onSelect={(e)=>{setNavStatus(e)}}  defaultActiveKey={navStatus}>
                                <Nav variant="pills" >
                                    <Nav.Item>
                                        <Nav.Link eventKey="delivery">Доставка</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="pickup">Самовывоз</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                    </Tab.Container>

<div>
                                        Выберите адрес доставки или <a className={styles.addNewAddress} onClick={handleAddressShow}>добавьте новый</a>
                                        <ListGroup defaultActiveKey={addressHolder[0].id}>
                                            {addressHolder.map((item)=>(
                                                <ListGroup.Item key={item.id} eventKey={item.id}>{item.address}</ListGroup.Item>
                                            ))}


                                        </ListGroup>
                                        <Button onClick={handleAddressShow} variant={'success'} className={'mt-2 mb-2'}> Новый адрес</Button>
                                        <Card>
                                            <Card.Body className={styles.cartCountBlock}>
                                                <h3>Итого: {amountHolder} руб.</h3>
                                                <Button disabled={addressHolder.length === 0} onClick={handleCountShow}>Посчитать цену</Button>
                                            </Card.Body>

                                        </Card>
</div>



                </Card.Body>
                {pickupModalHolder &&
                <PickupOrder handleSuccessShow={handleSuccessShow} chosenAddress={chosenAddress} pickupData={pickupTypes} handlePickupClose={handlePickupClose}></PickupOrder>
                }
                <Modal show={addressShow} onHide={handleAddressClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Выберите новый адрес</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <DeliveryMap takeAddressHandler={takeAddressHandler}></DeliveryMap>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={handleAddressClose} variant="secondary">Закрыть</Button>
                        <Button onClick={addNewAddress} variant="primary">Добавить</Button>
                    </Modal.Footer>
                </Modal>
            </Card>

                    <Modal  size={'lg'} className={styles.finishModal}  show={showCount} onHide={handleCountClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Итог</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Выберите вариант доставки:
                            {!typesIsLoading &&
                                <div>
                                {
                                    deliveryTypes.map((item) => (
                                        <Form.Check
                                            key={item.name}
                                            type={"radio"}
                                            onClick={()=>{
                                                setChoosenType(item)
                                                setStartDate(choosenType.type.change_date ? new Date() : '')
                                            }}
                                            checked={choosenType == item ? true : false}
                                            label={ `${item.delivery_type} (${item.delivery_date}) ` }
                                        />
                                    ))
                                }
                                <Card>
                                    <ListGroup className={styles.finishCartList}>
                                        {choosenType.cart.map((item)=>(
                                            <ListGroup.Item className={styles.finishCartBlock}>
                                                <div className={styles.itemImgBlock}>
                                                    <img className={styles.itemImg} src={item.images[0]} alt="Фото товара"/>
                                                    <span className={styles.itemCode}>Код товара: {item.id}</span>
                                                </div>

                                                <div className={styles.finishItemName}>{item._nomenclature.name}</div>
                                                <span className={styles.itemPrice}> {item.middle_cost} руб.</span>
                                            </ListGroup.Item>
                                        ))}


                                    </ListGroup>
                                    <div className={styles.finishPricesBlock}>
                                        <p className={'mt-2'} style={{fontSize:'1.5rem', fontWeight:'bolder'}}>Итого: {choosenType.cost_with_delivery} руб.</p>
                                        <p >Доставка: {choosenType.delivery_cost} руб.</p>
                                        <p>Товары: {choosenType.cost} руб.</p>
                                    </div>
                                    <span>Дата и время доставки</span>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        timeInputLabel="Время доставки:"
                                        dateFormat="dd.MM.yyyy HH:mm"
                                        locale="pt-BR"
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        minDate={new Date()}
                                        showTimeSelect={choosenType.type.change_time ? true : false}
                                        showTimeSelectOnly={choosenType.type.change_time && !choosenType.type.change_date ? true : false}
                                    />
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Номер телефона"
                                        className="mt-2"
                                    >
                                        <Form.Control onChange={(e)=>{
                                            setPhoneHolder(e.target.value)}
                                        } type="email" placeholder="+7 (___)___ -__-__" />
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
                                </div>
                            }

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCountClose}>
                                Закрыть
                            </Button>
                            <Button variant="primary" onClick={createDeliveryOrder}>
                                Оформить
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            }
        </div>

    );
};

export default CartPage;
