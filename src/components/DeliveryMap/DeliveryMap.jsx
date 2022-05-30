import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import React, {useEffect, useRef, useState} from 'react';
import marker from '../../assets/map-marker.png'
import styles from './DeliveryMap.module.css'
import mapboxgl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Map, { Marker, Popup,NavigationControl, GeolocateControl, MapContext  } from "react-map-gl";
import axios from "axios"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './search.css'
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
        setSelectedCoord({ longitude: e.lngLat.lng, latitude: e.lngLat.lat })
        let newAddress;
       await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=` + token)
            .then((response)=>{
                setSelectedCoord((prevState)=>({...prevState, address: response.data.features[0].place_name}))
                newAddress = response.data.features[0].place_name
            })
            .finally(()=>{
                 setShowPopup(true)
                props.takeAddressHandler({longitude:e.lngLat.lng, latitude:e.lngLat.lat, address: newAddress})
            })
    }
    //MapboxGeocoder
    async function searchCoord(e) {
        setSelectedCoord({ longitude: e.coordinates[0], latitude: e.coordinates[1] })
        setViewState({ longitude: e.coordinates[0],
            latitude: e.coordinates[1],
            zoom: 10,})
        let newAddress;
       await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.coordinates[0]},${e.coordinates[1]}.json?access_token=` + token)
            .then((response)=>{
                console.log("this is respo");
                console.log(response);
                setSelectedCoord((prevState)=>({...prevState, address: response.data.features[0].place_name}))
                newAddress = response.data.features[0].place_name
            })
            .finally(()=>{
                 setShowPopup(true)
                props.takeAddressHandler({longitude:e.coordinates[0], latitude:e.coordinates[1], address: newAddress})
            })
    }
    useEffect(() => {
        const geocoder = new MapboxGeocoder({
            accessToken: token,
            zoom: 4,
            placeholder: 'Введите адресс...',
            mapboxgl: mapboxgl,
            reverseGeocode: true,
            countries: 'ru',
            language: 'ru',
            });
            geocoder.addTo('#geocoder');
            geocoder.on('result', (event) => {
            searchCoord(event.result.geometry);
            });
    }, [])
    const [viewState, setViewState] = React.useState({
        longitude: 30.3158,
        latitude: 59.93901,
        zoom: 10,
      });
    return (
        <>
        <div className={styles.geocoder} id='geocoder'></div>
        <Map
            {...viewState}
            onClick={(e)=>{selectCoord(e)}}
            mapboxAccessToken={token}
            style={{width: '100%', height: 400}}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            reverseGeocode= {true}
            onMove={evt => setViewState(evt.viewState)}
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
            <NavigationControl >
            </NavigationControl>
            <GeolocateControl >
            </GeolocateControl>
        </Map>
        </>
    );
};

export default DeliveryMap;
