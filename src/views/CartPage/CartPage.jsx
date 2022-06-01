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
    FloatingLabel,
    Spinner
} from "react-bootstrap";
import api from "../../plugins/axios/api";
import cross from "../../assets/xmark-solid.svg"
import DeliveryMap from "../../components/DeliveryMap/DeliveryMap";
import {useCookies} from "react-cookie";
import DatePicker from 'react-datepicker'
import user from "../../store/user";
import cart from "../../store/cart";
import PickupOrder from "./PickupOrder";
import {useNavigate} from "react-router-dom";
import SuccessOrder from "../../components/SuccessOrder/SuccessOrder";


const CartPage = () => {
    const [cookies] = useCookies(['userCity, tmt, token']);
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
    const [orderNum,setOrderNum] = useState()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [load, isLoad] = useState(false);

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
    const handleSuccessHide = () => {
        setSuccessModal(false)
    };

    const handleCountClose = () => setCountShow(false);
    const handleCountShow =  () => {
      if(cookies.token){
        if (navStatus === 'delivery') {
            // deliveryTypes.length == 0 ?
                api(`marketplace/order/delivery_all/?city=${cookies.userCity.id}&address=${chosenAddress}`)
                    .then((response) => {
                        setDeliveryTypes(response.data)
                        setChoosenType(response.data[0])
                    })
                    .finally(() => {
                        setTypesIsLoading(false)
                        setCountShow(true)
                    })
                // :
                // setCountShow(true)
        }
        if (navStatus === 'pickup'){
            api(`marketplace/order/pickup_all/?city=${cookies.userCity.id}&address=${chosenAddress}`)
                .then((response) => {
                    setPickupTypes(response.data)
                    setChoosenPickupType(response.data[0])
                })
                .finally(() => {
                    setPickupModalHolder(true)
                })
        }
      }
      else{
          user.showAuthModal(true)
      }
    };

    const handleAddressClose = () => setAddressShow(false);
    const handleAddressShow = () => { setAddressShow(true) }



    function handlePickupClose(){
        setPickupModalHolder(false);
    }


    useEffect(()=>{
            api(`marketplace/cart/?tmp=${cookies.tmt}`)
            .then((response)=>{
                setCardHolder(response.data.result)
                setAmountHolder(response.data.amount)
            })
            .finally(()=>{
                isLoad(true)
            })
        api(`marketplace/order-address/?tmp=${cookies.tmt}`)
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
       function handleChanges(e,id,middle_cost,index, count) {
           let oneCost;
           let newPrice; 
           let newCount;
           let changesValue;
           let diffNumber;
           if(e.target.value > 0 && count > 0){
            oneCost = middle_cost / count
            newPrice = oneCost * Number(e.target.value)
            newCount = Number(e.target.value)
           } else{
            oneCost = middle_cost / count
            newPrice = oneCost * 1
            newCount = 1
           }
           setCardHolder(
              cartHolder.map((item) =>
                 item.id === id ? {...item, count: newCount, middle_cost: newPrice} : item
             )
         )
         if(e.target.value > 0){
            if(count < e.target.value){
                diffNumber = e.target.value - count
                changesValue = amountHolder + oneCost * diffNumber
             }
             else{
                diffNumber = count - e.target.value
                changesValue = amountHolder - oneCost * diffNumber
             }
             setAmountHolder(changesValue)
         }
         else{
            diffNumber = count - 1
            changesValue = amountHolder - oneCost * diffNumber
            setAmountHolder(changesValue)
         }
        // sendChanges(id,index)
     }

     function takeAddressHandler(props){
        setNewAddress(props)
     }
     function addNewAddress(){
        api.post(`marketplace/order-address/?tmp=${cookies.tmt}`,newAddress)
            .then((response)=>{
                if (response.status === 201) {
                    setAddressHolder((prevState => ([...prevState,response.data])))
                    setAddressShow(false)
                }
            }).catch(function (thrown){
                alert("Пожалуйста, уточните введённый вами адресс")
            })
     }
      function deleteItemFromCart(index,item){
        api.delete(`marketplace/cart/${item.id}/?tmp=${cookies.tmt}`)
            .then((response)=>{
                if(response.status === 204) {
                    setAmountHolder(amountHolder - item.middle_cost)
                    setCardHolder(cartHolder.filter((item,i) => index !== i))
                    cart.requestInfo()
                }
            })
            .finally(()=>{

            })
    }
    async function createDeliveryOrder(e){
        e.preventDefault()
        api.post(`marketplace/order/${choosenType.type.url}/?city=${cookies.userCity.id}&address=${chosenAddress}`,{
            phone:phonetHolder,
            est_time: startDate.toLocaleString('ru',{year: 'numeric',month:'numeric', day:'numeric', hour:'numeric', minute:'numeric'}).split(',').join(''),
            payment_method:'card',
            comment:commentHolder
        })
            .then(response =>{
                if (response.status === 200){
                    setOrderNum(response.data.id)
                    handleCountClose()
                    handleSuccessShow(response.data.id)
                }
            })
            .finally(()=>{
                cart.requestInfo()
            })
    }
    function incremetCount(count,id){
        api.post(`marketplace/cart/change/?tmp=${cookies.tmt}`,{
            "nomenclature": id,
            "count": count + 1
        })
            .then((response)=>{
                if (response.status === 200){
                    setCardHolder(cartHolder.map((item)=>{
                            if (item._nomenclature.id === id){
                                let diffAmount = item.middle_cost / item.count
                                setAmountHolder(amountHolder + diffAmount)
                                return {...item, count:Number(response.data.count), middle_cost:response.data.middle_cost}
                            } else {
                                return item
                            }
                }))
                }
            })
    }
    function decremetCount(count,id){
        if (count === 1) return
        api.post(`marketplace/cart/change/?tmp=${cookies.tmt}`,{
            "nomenclature": id,
            "count": count - 1
        })
            .then((response)=>{
                //change middle cost
                if (response.status === 200){
                    setCardHolder(cartHolder.map((item)=>{
                        if (item._nomenclature.id === id){
                            let diffAmount = item.middle_cost / item.count
                            setAmountHolder(amountHolder - diffAmount)
                            return {...item, count:Number(response.data.count), middle_cost:response.data.middle_cost}
                        } else {
                            return item
                        }
                    }))
                }
            })
    }
function setOrderId(id){
        setOrderNum(id)
    }
    function sendChanges(e,id){
        if (e.target.value === "0"){
            setCardHolder(cartHolder.map((item)=>{
                if (item._nomenclature.id === id){
                    return {...item, count:1}
                } else {
                    return item
                }
            }))
        } else{
            api.post(`marketplace/cart/change/?tmp=${cookies.tmt}`,{
                "nomenclature": id,
                "count": Number(e.target.value)
            })
        }
    }
    function deleteAddress(item){
        api.delete(`marketplace/order-address/${item.id}/?tmp=${cookies.tmt}`)
            .then((response)=>{
               if (response.status === 204){
                   // setAddressHolder(
                   //     addressHolder.map((address)=>{
                   //         if (address.id === item.id){
                   //             return
                   //         }
                   //         else {
                   //             return item
                   //         }
                   //     })
                   // )
                   setAddressHolder(addressHolder.filter((address) => address.id !== item.id))


               }
            })
    }
    //  useEffect(()=>{
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
                            {load ? cartHolder.map((item, index)=>(
                                <ListGroup.Item key={item.id} className={styles.listItem}>
                                    <div className={styles.itemImgBlock}>
                                    <img className={styles.itemImg} src={item.images[0]} alt="Фото товара"/>
                                        <span className={styles.itemCode}>Код товара: {item.id}</span>
                                    </div>

                                    <div className={styles.itemName}>{item._nomenclature.name}</div>

                                    <div className={styles.actionsBlock}>
                                        <span className={styles.itemMainPrice}>от {item.middle_cost} руб.</span>
                                        <InputGroup className={styles.changeCountAction} >
                                            <InputGroup.Text onClick={()=>{decremetCount(item.count,item._nomenclature.id)}} className={styles.countDecrementBtn} id="inputGroup-sizing-default">-</InputGroup.Text>
                                            <FormControl
                                                type={'number'}
                                                aria-label="Default"
                                                className={styles.countInput}
                                                onChange={(event)=>{
                                                    handleChanges(event,item.id, item.middle_cost, index, item.count)
                                                    
                                                }}
                                                onBlur={(e)=>{
                                                    sendChanges(e,item._nomenclature.id)
                                                }}
                                                step="1"
                                                min="1"
                                                aria-describedby="inputGroup-sizing-default"
                                                value={item.count}
                                            />
                                            <InputGroup.Text onClick={()=>{incremetCount(item.count,item._nomenclature.id)}} className={styles.countIncrementBtn} id="inputGroup-sizing-default">+</InputGroup.Text>
                                        </InputGroup>
                                        <span onClick={()=>{deleteItemFromCart(index,item)}}  className={styles.actionsDeleteBtn}>Удалить</span>
                                    </div>
                                </ListGroup.Item>
                            )): <div className={styles.wrapper_spinner}><Spinner className={styles.spinner} animation="grow" /></div>}

                        </ListGroup>
                    </Card.Body>
                </Card>
                    {successModal &&
                        <SuccessOrder setOrderNum={setOrderNum} orderNum={orderNum}></SuccessOrder>
                    }


            <Card className={styles.cartSubmitBlock}>
                <Card.Title>Выберите способ получения</Card.Title>
                <Card.Body className={styles.cartDeliveryBody}>
                    <Tab.Container onSelect={(e)=>{
                        setNavStatus(e)}}  defaultActiveKey={navStatus}>
                                <Nav variant="pills" >
                                    <Nav.Item>
                                        <Nav.Link className='btn' eventKey="delivery">Доставка</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='btn' eventKey="pickup">Самовывоз</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                    </Tab.Container>

<div>

    {addressHolder.length !== 0 &&
        <div>        Выберите адрес доставки или <a className={styles.addNewAddress} onClick={handleAddressShow}>добавьте новый</a>
        <ListGroup defaultActiveKey={addressHolder[0].id}>
            {addressHolder.map((item) => (
                <ListGroup.Item className={styles.addressItem}  key={item.id} eventKey={item.id}>
                    <span style={{paddingLeft: '5px'}}>{item.address}</span>
                    <img title='удалить адрес' onClick={()=>{deleteAddress(item)}} className={styles.deleteBtn} src={cross} alt="rh"/>
                </ListGroup.Item>
            ))}


        </ListGroup>
        </div>
    }
                                        <Button title={navStatus=== 'delivery' ? 'укажите ваш адрес, на который будет доставлен товар' : 'Адрес нужен, чтобы система могла наиболее точно подсказать вам лучшие предложения'} onClick={handleAddressShow} variant={'success'} className={'mt-2 mb-2'}> { navStatus === 'delivery' ? 'новый адрес' : 'укажите ваш адрес'}</Button>
                                        <Card>
                                            <Card.Body className={styles.cartCountBlock}>
                                                <h3>Итого: {amountHolder?.toFixed(2)} руб.</h3>
                                                <Button className={styles.btn_count_price} disabled={addressHolder.length === 0} onClick={handleCountShow}>Посчитать цену</Button>
                                            </Card.Body>

                                        </Card>
</div>



                </Card.Body>
                {pickupModalHolder &&
                <PickupOrder setOrderId={setOrderId} handleSuccessShow={handleSuccessShow} chosenAddress={chosenAddress} pickupData={pickupTypes} handlePickupClose={handlePickupClose}></PickupOrder>
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
                    {!typesIsLoading &&
                        <Modal size={'xl'} className={styles.finishModal} show={showCount} onHide={handleCountClose}>
                            <form onSubmit={(e)=>{createDeliveryOrder(e)}}>
                            <Modal.Header closeButton>
                                <Modal.Title>Итог</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Выберите вариант доставки:

                                <div>
                                    {
                                        deliveryTypes.map((item) => (
                                            <Form.Check
                                                key={item.name}
                                                type={"radio"}
                                                onChange={() => {
                                                    setChoosenType(item)
                                                    setStartDate(choosenType.type.change_date ? new Date() : '')
                                                }}
                                                checked={choosenType == item ? true : false}
                                                label={`${item.delivery_type} (${item.delivery_date}) `}
                                            />
                                        ))
                                    }
                                    <Card>
                                        <ListGroup className={styles.finishCartList}>
                                            {choosenType.cart.map((item) => (
                                                <ListGroup.Item key={item.id} className={styles.finishCartBlock}>
                                                    <div className={styles.itemImgBlock}>
                                                        <img className={styles.itemImg} src={item.images[0]}
                                                             alt="Фото товара"/>
                                                        <span className={styles.itemCode}>Код товара: {item.id}</span>
                                                    </div>

                                                    <div
                                                        className={styles.finishItemName}>{item._nomenclature.name}</div>
                                                        {/* change middle cost on cost  */}
                                                    <span className={styles.itemPrice}> {item.cost} руб.</span>
                                                </ListGroup.Item>
                                            ))}


                                        </ListGroup>
                                        <div className={styles.finishPricesBlock}>
                                            <p className={'mt-2'} style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 'bolder'
                                            }}>Итого: {choosenType.cost_with_delivery} руб.</p>
                                            <p>Доставка: {choosenType.delivery_cost} руб.</p>
                                            <p>Товары: {choosenType.cost} руб.</p>
                                        </div>
                                        <span>Дата и время доставки</span>
                                        <DatePicker
                                            required
                                            minDate={choosenType.type.url === 'delivery_today' ? new Date() : new Date().setDate(new Date().getDate() + 1)}
                                            selected={startDate}

                                            onChange={(date) => setStartDate(date)}
                                            timeInputLabel="Время доставки:"
                                            dateFormat="dd.MM.yyyy HH:mm"
                                            locale="pt-br"
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            showTimeSelect={choosenType.type.change_time ? true : false}
                                            showTimeSelectOnly={choosenType.type.change_time && !choosenType.type.change_date ? true : false}
                                        />
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label="Номер телефона"
                                            className="mt-2"
                                        >
                                            <Form.Control required onChange={(e) => {
                                                setPhoneHolder(e.target.value)
                                            }
                                            } type="tel" placeholder="+7 (___)___ -__-__"/>
                                        </FloatingLabel>
                                        <FloatingLabel controlId="floatingTextarea2"
                                                       label="Комментарий к заказу (дополнительно)">
                                            <Form.Control
                                                as="textarea"
                                                onChange={(event) => {
                                                    setCommentHolder(event.target.value)
                                                }
                                                }
                                                placeholder="Leave a comment here"
                                                style={{height: '100px'}}
                                                className={'mt-2'}
                                            />
                                        </FloatingLabel>
                                    </Card>
                                </div>


                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCountClose}>
                                    Закрыть
                                </Button>
                                <Button variant="primary" type={'submit'} >
                                    Оформить
                                </Button>
                            </Modal.Footer>
                            </form>
                        </Modal>
                    }
                </div>
            }
        </div>

    );
};

export default CartPage;
//TODO delete acc
//TODO доставка убрать прошедшее время
//TODO открыто сейчас , есть всё. фильтр на самовывозе
//TODO редактирование количества товаров в корзине