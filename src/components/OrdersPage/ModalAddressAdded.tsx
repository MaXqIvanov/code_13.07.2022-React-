import mapboxgl from 'mapbox-gl';
import React, { useEffect, useState } from 'react'
import styles from '../../scss/OrdersPage.module.scss';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export const ModalAddressAdded = ({setVisibleAddress}:any) => {
    const [currentAddress, setCurrentAddress] = useState<any>('');
    useEffect(() => {
        mapboxgl.accessToken = String(process.env.REACT_APP_MAPBOX_TOKEN)
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            placeholder: 'Введите ваш адрес...',
            countries: 'ru',
            language: 'ru',
        });
        geocoder.addTo('#geocoder');
        geocoder.on('result', (e:any) => {
            setCurrentAddress(e.result);
            });
             
            // Clear results container when search is cleared.
            geocoder.on('clear', () => {
            setCurrentAddress('');
            });
    }, [])
    
    useEffect(() => {
    console.log(currentAddress);
    }, [currentAddress])
    
  return (
    <div className={styles.address_added}>
        <div className={styles.address_added_wrapper}>
            <div className={styles.address_added_title}>Добавить новый адрес</div>
            <div id='geocoder' className={styles.geocoder_modal_add}></div>
            <div className={styles.label_address}>Ваш выбранный адрес: </div>
            {currentAddress && <div>{currentAddress ? currentAddress.place_name_ru : 'Выберите адрес'}</div>}
            <div className={styles.label_personal_info}>Контактные данные получателя:</div>
            <div className={styles.block_group_name}>
             <input type={'text'} placeholder="Имя получателя" className={styles.input_name} />
             <div className={styles.example_name}>Например: Иванов Иван Иванович</div>
            </div>
            <i onClick={()=>setVisibleAddress(false)} className={`bi bi-x ${styles.close_btn}`}></i>
            <div className={styles.continue_btn}>Продолжить</div>
        </div>
    </div>
  )
}
