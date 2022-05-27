import React, {useEffect, useRef, useState} from 'react';
import marker from '../../assets/map-marker.png'
import styles from './DeliveryMap.module.css'

import mapboxgl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Map, {Marker, Popup,ControlPanel} from "!react-map-gl";
import axios from "axios"; // eslint-disable-line import/no-webpack-loader-syntax
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
mapboxgl.accessToken = 'pk.eyJ1IjoiZGllbGl0IiwiYSI6ImNreGJ3b3RlOTByOHQycHE5bWwzaXlxZ2cifQ.1QkwgR8DegdGymUZL3iTjg';


const DeliveryMap = (props) => {
    const [token, setToken] = useState('pk.eyJ1IjoiZGllbGl0IiwiYSI6ImNreGJ3b3RlOTByOHQycHE5bWwzaXlxZ2cifQ.1QkwgR8DegdGymUZL3iTjg')
    const [selectedCoord, setSelectedCoord] = useState(null)
    const [showPopup, setShowPopup] = useState(true);
    useEffect(()=>{
        if (selectedCoord === null) return

    },[selectedCoord])

    async function selectCoord(e) {
        await setSelectedCoord({longitude:e.lngLat.lng, latitude:e.lngLat.lat})
        // this is change selectedCoord.longtitude on e.lngLat.lng
        let newAddress;
       await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=` + token)
            .then((response)=>{
                setSelectedCoord((prevState)=>({...prevState, address: response.data.features[0].place_name}))
                newAddress = response.data.features[0].place_name
            })
            .finally(()=>{
                 setShowPopup(true)
                //  this is change 
                // props.takeAddressHandler(selectedCoord)
                props.takeAddressHandler({longitude:e.lngLat.lng, latitude:e.lngLat.lat, address: newAddress})
            })
    }
    return (
        <Map
            initialViewState={{
                longitude: 30.3158,
                latitude: 59.93901,
                zoom: 14
            }}
            onClick={(e)=>{selectCoord(e)}}
            mapboxAccessToken={token}
            style={{width: '100%', height: 400}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            {showPopup && selectedCoord !== null && (
                <Popup longitude={selectedCoord.longitude} latitude={selectedCoord.latitude}
                       anchor="bottom"
                       onClose={() => setShowPopup(false)}>
                    {selectedCoord.address}
                </Popup>)}
            {selectedCoord !== null &&
              <Marker  longitude={selectedCoord.longitude} latitude={selectedCoord.latitude} anchor="bottom">
                    <img style={{width:28}} src={marker}/>
              </Marker> }
            {/* {selectedCoord == null &&
            <Marker longitude={this.longitude} latitude={this.latitude} anchor="bottom">
                <img style={{width:28}} src={marker}/>
            </Marker>
            } */}
        </Map>
    );
};

export default DeliveryMap;
