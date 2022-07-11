import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../../scss/MainPage.module.scss';

export const CartCategory = ({category}:any) => {
    const nav = useNavigate()
    
  return (
    <div className={styles.cart}>
        <div onClick={()=>nav(`/category/${category.id}`)} className={styles.cart_wrapper}>
            <div style={{backgroundImage: `url(${category.img})`}} className={styles.category_img}></div>
            <div className={styles.title_category}>{category.name}</div>
        </div>
    </div>
  )
}
