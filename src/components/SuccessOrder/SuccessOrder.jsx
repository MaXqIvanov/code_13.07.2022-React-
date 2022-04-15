import React from 'react';
import {Modal,Button} from "react-bootstrap";
import success from '../../assets/success.png'
import styles from './SuccessOrder.module.css'
import {useNavigate} from "react-router-dom";

const SuccessOrder = (props) => {
    const navigate = useNavigate()

    return (
        <Modal backdrop={'static'} show={true}>
            <Modal.Header>
                <Modal.Title>Заказ успешно создан</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className={styles.successBlock}>
                <img className={styles.successImg} src={success} alt=""/>
                    <p>Ваш заказ <a className={styles.link} onClick={()=>{navigate(`/order/${props.orderNum}`)}}>#{props.orderNum}</a> создан. Статус заказа вы можете отследить <a onClick={()=>{navigate(`/order/${props.orderNum}`)}} className={styles.link}>здесь</a></p>
                </div>
            </Modal.Body>
<Modal.Footer>
    <Button onClick={()=>{navigate('/')}}>Закрыть</Button>
</Modal.Footer>
            </Modal>
    );
};

export default SuccessOrder;
