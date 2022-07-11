import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CartProod } from '../components/CurrentCategoryPage/CartProod';
import styles from '../scss/CurrentCategoryPage.module.scss';
import { getProodAsync } from '../store/proodSlice';

export const CurrentCategoryPage = () => {
    const dispatch = useDispatch()
    const { id } = useParams();
    const {prood_category} = useSelector((state:any)=> state.prood)
    useEffect(() => {
        dispatch(getProodAsync({id}))
    }, [])
    
  return (
    <div className={styles.current_category}>
        <div className={styles.current_category_wrapper}>
           {prood_category.map((elem:any)=><CartProod key={elem.id} prood={elem}/>)}
        </div>
    </div>
  )
}
