import React, {useEffect, useState} from 'react';
import styles from '../scss/MainPage.module.scss';
import api from '../plugins/axios/api'
import { AdvertisingComponent } from '../components/Mainpage/AdvertisingComponent';
import { useDispatch } from 'react-redux';
import { getCategoryAsync } from '../store/proodSlice';
import { CategoryComponent } from '../components/Mainpage/CategoryComponent';

export const MainPage = () => {
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(getCategoryAsync())
    }, [])
    
    return (
        <div className={styles.mainBlock}>
            <div className={styles.mainBlock_wrapper}>
                <AdvertisingComponent />
                <div className={styles.category_title}><span>Категории:</span></div>
                <CategoryComponent />
            </div>
        </div>
    );
};

export default MainPage;
