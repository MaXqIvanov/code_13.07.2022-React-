import React from 'react';
import {Modal,Button} from "react-bootstrap";
import success from '../../assets/success.png'
import styles from './SuccessOrder.module.css'

const SuccessOrder = (props) => {
    return (
        <Modal show={'true'}>
            <Modal.Header>
                <Modal.Title>Заказ успешно создан</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className={styles.successBlock}>
                <img className={styles.successImg} src={success} alt=""/>
                    <p>Ваш заказ <a href="">#88</a> создан. Статус заказа вы можете отследить <a href="">здесь</a></p>
                </div>
            </Modal.Body>
<Modal.Footer>
    <Button>Закрыть</Button>
</Modal.Footer>
            </Modal>
    );
};

export default SuccessOrder;
