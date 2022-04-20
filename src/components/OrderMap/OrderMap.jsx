import React from 'react';
import Map, {Marker, Popup} from "react-map-gl";
import {Button, Modal} from "react-bootstrap";
import styles from './OrderMap.module.css'

const OrderMap = (props) => {
    return (
        <div>
            <Modal show={true} onHide={props.handleMapClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Адрес заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.orderInfo &&
                        <Map
                            initialViewState={{
                                longitude: props.orderInfo.longitude,
                                latitude: props.orderInfo.latitude,
                                zoom: 14
                            }}
                            style={{width: '100%', height: 400}}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                        >
                            <div className={styles.controlPanel}>

                                <span><b>Адрес:</b> {props.orderInfo.address}</span>
                            </div>
                            {/*{showPopup && selectedCoord !== null && (*/}
                            {/*    <Popup longitude={selectedCoord.longitude} latitude={selectedCoord.latitude}*/}
                            {/*           anchor="bottom"*/}
                            {/*           onClose={() => setShowPopup(false)}>*/}
                            {/*        {selectedCoord.address}*/}
                            {/*    </Popup>)}*/}

                            <Marker longitude={props.orderInfo.longitude} latitude={props.orderInfo.latitude} anchor="bottom">


                            </Marker>

                        </Map>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.handleMapClose} variant="secondary" >
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default OrderMap;