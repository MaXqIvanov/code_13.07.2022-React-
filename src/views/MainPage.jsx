import React, {useEffect, useState} from 'react';
import styles from './MainPage.module.css'
import {Card, Carousel, Col, ListGroup, Row} from "react-bootstrap";
import api from '../plugins/axios/api'
import { useNavigate } from "react-router-dom";


const MainPage = () => {
    let navigate = useNavigate();
    const [categoryHolder, setCategoryHolder] = useState([])
    useEffect(()=>{
        api.get('marketplace/category')
            .then((response)=>{
                setCategoryHolder(response.data)
            })
    },[])



    return (
        <div className={styles.mainBlock}>
            <Row>
                <Col >
                    <Card className={styles.carouselCard}>
                        <Carousel className={styles.carousel}>
                            <Carousel.Item interval={5000}>
                                <img
                                    className={styles.carouselImg}
                                    src="https://gotoshop.ua/img/p/2021/02/134066/2098797-134066-988216121824547485.jpg?t=t1612182446"
                                    alt="First slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item interval={5000}>
                                <img
                                    className={styles.carouselImg}
                                    src="https://magnumrpk.ru/wp-content/uploads/2020/02/8-0-800x600.jpg"
                                    alt="Second slide"
                                />

                            </Carousel.Item>
                            <Carousel.Item interval={5000}>
                                <img
                                    className={styles.carouselImg}
                                    src="https://telegra.ph/file/ed9aaaae27b038025e75c.jpg"
                                    alt="Third slide"
                                />

                            </Carousel.Item>
                        </Carousel>
                    </Card>
                    <Card className={styles.categoryCard}>
                        <Card.Header>
                            <Card.Title><h3>Категории товаров</h3></Card.Title>
                        </Card.Header>
                            <Card.Body className={styles.categoryBlock}>
                                {categoryHolder.map((item)=>(
                                    <Card key={item.id} onClick={ ()=>{navigate(`/category/${item.id}`)} } className={styles.categoryItem}>
                                        <Card.Img alt={item.name} title={item.name}  className={styles.categoryImg} variant="top" src={item.img} />
                                        <Card.Body >
                                            <Card.Title className={styles.categoryTitle}>{item.name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                    ))}
                            </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MainPage;
