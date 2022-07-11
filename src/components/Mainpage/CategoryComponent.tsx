import React from 'react'
import { useSelector } from 'react-redux';
import styles from '../../scss/MainPage.module.scss';
import { CartCategory } from './CartCategory';

export const CategoryComponent = () => {
    const {category} = useSelector((state:any)=> state.prood);

  return (
    <div className={styles.category}>
        <div className={styles.category_wrapper}>
            {category ? category.map((elem:any)=><CartCategory category={elem} key={elem.id}/>)
            : <></>
            }
        </div>
    </div>
  )
}
