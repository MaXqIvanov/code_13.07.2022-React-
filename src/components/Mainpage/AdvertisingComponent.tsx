import React from 'react'
import { Carousel } from 'react-bootstrap';
import styles from '../../scss/MainPage.module.scss';

export const AdvertisingComponent = () => {
  return (
    <div className={styles.advertising}>
        <div className={styles.advertising_wrapper}>
            <div className={styles.carouse_custom_wrapper}>
                <Carousel className={styles.slides} variant="dark">
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src="https://krot.info/uploads/posts/2021-02/1613794398_55-p-fon-dlya-aktsii-skidok-60.jpg"
                        alt="First slide"
                        />
                        <Carousel.Caption>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src="https://express-china.ru/upload/iblock/35c/beauty_salon_tools.jpg"
                        alt="Second slide"
                        />
                        <Carousel.Caption>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src="https://nailmarkets.ru/wa-data/public/shop/img/189866150_350ad65d7d-1920x1080-1.jpg"
                        alt="Third slide"
                        />
                        <Carousel.Caption>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    </div>
  )
}
