import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../scss/CurrentCategoryPage.module.scss';
import { addProodBasketAsync, deleteProodBasketAsync } from '../../store/proodSlice';

export const CartProod = ({prood}:any) => {
  const dispatch = useDispatch()
  const {prood_basket} = useSelector((state:any)=> state.prood);
  const [proodAdded, setProodAdded] = useState(true);

  useEffect(() => {
    setProodAdded(prood_basket.filter((elem:any)=>{ if(elem.product === prood.id){
        return 1;
      }else{
        return 0
      }}) == 0)
  }, [prood_basket])
  
  
  
  return (
    <div className={styles.cart_prood}>
        <div className={styles.cart_prood_wrapper}>
          <div style={{backgroundImage: `url(${prood.photos[0]})`}} className={styles.img_prood}></div>
          <div className={styles.prood_description}>{prood.name}</div>
          <div className={styles.prood_count}>в наличии: {prood.count}шт.</div>
          <div className={styles.prood_group}>
            <div className={`${styles.group_price_category}`}>
              {prood.cost_with_discount ? <div className={styles.prood_discount_category}>{prood?.cost}</div> : <></>}
              <div className={styles.prood_price}>{prood.cost_with_discount ? prood?.cost_with_discount : prood.cost} ₽</div>
            </div>
            {
             proodAdded ? 
              <i onClick={()=>dispatch(addProodBasketAsync(prood))} title='Положить в корзину' className={`bi bi-bag-plus ${styles.btn_basket}`}></i>
              :
              <i onClick={()=>dispatch(deleteProodBasketAsync(prood))} title='Уже в корзине' style={{color: 'green'}} className={`bi bi-bag-check ${styles.btn_basket}`}></i>
            }
          </div>
        </div>
    </div>
  )
}
