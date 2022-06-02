import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Row, Pagination} from "react-bootstrap";
import styles from "./CategoryPage.module.css"
import api from "../../plugins/axios/api";
import {useNavigate, useParams} from "react-router-dom";
import {Cart2, Check} from "react-bootstrap-icons";
import cart from "../../store/cart";
import {observer} from "mobx-react-lite";
import {useCookies} from "react-cookie";
import axios from 'axios';

const CategoryPage = observer(() => {
    const ref = useRef()
    const navigate = useNavigate()
    const [itemsHolder, setItemsHolder] = useState([])
    const [cookies] = useCookies(['userCity, tmt']);
    const [activeP, setActiveP] = useState(1);
    const [countP, setCountP] = useState(2);
    // limit -  лимит (количество товаров приходящие с бэка)
    const limit = 30;
    let pageParams = useParams()


    useEffect(()=>{
        api(`marketplace/nomenclature/?category=${pageParams.id}`)
            .then((response)=>{
                // setItemsHolder((prevState => ([...prevState,response.data.results])))
                // change this
                
                setItemsHolder(response.data.results)
            })
    },[pageParams.id])

    function addToCart(id, qty){
        api.post(`marketplace/cart/change/?tmp=${cookies.tmt}`,{
            nomenclature: id,
            count: qty
        })
            .then((response)=>{
                if (response.status === 200){
                    setItemsHolder(
                        itemsHolder.map((item) =>
                            item.id === id ? { ...item, cart_position: 1 } : item
                        )
                    )
                    cart.requestInfo()
                }
            })
    }
    function deleteFromCart(id,qty){
      api.post(`marketplace/cart/change/?tmp=${cookies.tmt}`,{
            nomenclature: id,
            count: qty
        })
            .then((response)=>{
                if (response.status === 204){
                    setItemsHolder(
                        itemsHolder.map((item) =>
                            item.id === id ? { ...item, cart_position: 0 } : item
                        )
                    )
                }
                cart.requestInfo()
            })
    }


        // pagination
        // let active = activeP;
        // let items = [];
        // for (let number = 1; number <= countP; number++) {
        // items.push(
        //     <Pagination.Item onClick={()=>getProod(number)} key={number} active={number === active}>
        //         {number}
        //     </Pagination.Item>,
        // );
        // } 
        // const getProod = (number)=>{
        //     setActiveP(number)
        //     api(`marketplace/nomenclature/?category=${pageParams.id}`)
        //     .then((response)=>{
        //         // debugger
        //         setItemsHolder(response.data.results)
        //     })
        // }
     
    return (
        <div className={styles.wrapper_categoryPage}>
            <Row>
                <Col>
                    <Card className={styles.itemCard}>
                        <Card.Header>
                            <Card.Title><h3>Результат поиска</h3></Card.Title>
                        </Card.Header>
                        <Card.Body className={styles.itemBlock}>
                            {itemsHolder.map((item, cardIndex)=>(
                                <Card key={item.id} className={styles.item}>
                                    <div  onClick={()=>{ navigate('/item/' + item.id)}} className={styles.imgBlock} >
                                        <img  className={styles.itemImg + ' ' + 'img' + '-' + cardIndex} ref={ref} src={item.images[0]} alt={item.name}>
                                        </img>
                                    </div>

                                    <Card.Body >
                                        <Card.Title onClick={()=>{ navigate('/item/' + item.id) }} title={item.name} className={styles.itemTitle}>{item.name}</Card.Title>
                                    </Card.Body>
                                    <Card.Footer className={styles.itemFooter}>
                                        {item.cart_position === 0 &&
                                            <Button onClick={() => {
                                                addToCart(item.id, 1,cardIndex)
                                            }} title={"В корзину"} className={styles.cartBtn}>
                                                от {item.middle_cost} руб. <Cart2/>
                                            </Button>
                                        }
                                        {item.cart_position !== 0 &&
                                            <Button variant={"outline-warning"} onClick={() => {
                                                deleteFromCart(item.id, 0)
                                            }} title={"В корзине"} className={styles.cartBtn}>
                                                В корзине <Check size={'1.5rem'}></Check>
                                            </Button>
                                        }
                                    </Card.Footer>
                                    {/*<div  className={styles.test}>*/}
                                    {/*{item.images.map((img,index)=>(*/}
                                    {/*    <div></div>*/}
                                    {/*))}*/}
                                    {/*</div>*/}
                                </Card>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* pagination */}
            {/* <div className={styles.pagination_block}>        
                <Pagination size="sm">{items}</Pagination>
            </div> */}
        </div>
    );
});

export default CategoryPage;