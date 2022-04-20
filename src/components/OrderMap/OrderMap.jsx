import React from 'react';
import styles from './OrderMap.module.css'
import Map, {Marker, Popup} from "react-map-gl";
import {Button, Modal} from "react-bootstrap";

const OrderMap = (props) => {
    return (
        <div>
            <Modal show={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.orderInfo &&
                        <Map
                            initialViewState={{
                                longitude: 30.3158,
                                latitude: 59.93901,
                                zoom: 14
                            }}
                            style={{width: '100%', height: 400}}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                        >
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
                    <Button variant="secondary" >
                        Close
                    </Button>
                    <Button variant="primary" >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default OrderMap;