import React, {useEffect, useState} from 'react';
import styles from './SearchPage.module.css'
import {Button, Card, Col, Row} from "react-bootstrap";
import {Cart2, Check, Search} from "react-bootstrap-icons";
import {useNavigate, useSearchParams} from "react-router-dom";
import api from "../../plugins/axios/api";
import cart from "../../store/cart";

const SearchPage = () => {
    let [ itemsHolder, setItemsHolder] = useState([


    ])
    let navigate = useNavigate()
    let [searchParams] = useSearchParams()
    useEffect(() => {
        console.log('Гайка' == 'гайка')
        api('marketplace/nomenclature/?search=' + searchParams.get('q'))
            .then((response)=>{
                setItemsHolder(response.data.results)
            })
    }, [searchParams.get('q')]);

    function goToItem(id){
        navigate('/item/' + id)
    }
    function addToCart(id, qty){
        api.post('marketplace/cart/change/',{
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
        api.post('marketplace/cart/change/',{
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


    return (
        <Row>
            <Col>
                <Card className={styles.itemCard}>
                    <Card.Header>
                        <Card.Title><h3>Результат поиска</h3></Card.Title>
                    </Card.Header>
                    <Card.Body className={styles.itemBlock}>
                        {itemsHolder.length === 0 &&
                            <div className={styles.searchNull}>Поиск не дал результатов</div>
                        }
                        {itemsHolder.map((item, cardIndex)=>(
                            <Card className={styles.item}>
                                <Card.Img onClick={()=>{goToItem(item.id)}} alt={item.name} title={item.name}  className={styles.itemImg} variant="top" src={item.images[0]} />
                                <Card.Body >
                                    <Card.Title onClick={()=>{goToItem(item.id)}} className={styles.itemTitle}>{item.name}</Card.Title>
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
                            </Card>
                        ))}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default SearchPage;