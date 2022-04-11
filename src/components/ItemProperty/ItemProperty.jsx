import React, {useEffect, useState} from 'react';
import styles from './ItemProperty.module.css'
import api from "../../plugins/axios/api";
import {useParams} from "react-router-dom";
import {Card} from "react-bootstrap";

const ItemProperty = ({itemName}) => {
    let pageParams = useParams()
    let [itemProperty, setItemProperty] = useState([])
    let [isLoading, setIsLoading] = useState(true)


    useEffect(()=>{
        getData()
    }, [pageParams.id])


    async function getData(){

        await api(`marketplace/nomenclature-properties/?nomenclature=${pageParams.id}`)

            .then((response)=>{
                setItemProperty(response.data)
                console.log(itemProperty)
            })
            .finally(()=>{
                setIsLoading(false)
            })
    }
    return (

    !isLoading &&
    <Card className={styles.mainBlock}>
<Card.Title>Характеристики {itemName}</Card.Title>
        {itemProperty.map((item, index) => (
            <div className={styles.property}>
                {item.name} : {item.str_value}
            </div>
        ))}
    </Card>

    );
};

export default ItemProperty;
