import React, {useEffect, useState} from 'react';
import styles from './MainPage.module.scss'
import api from '../plugins/axios/api'

export const MainPage = () => {
    return (
        <div className={styles.mainBlock}>
            <div className={styles.mainBlock_wrapper}>
                Основная страница
            </div>
        </div>
    );
};

export default MainPage;
