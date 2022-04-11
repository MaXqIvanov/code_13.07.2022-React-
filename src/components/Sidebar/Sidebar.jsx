import React, {useEffect, useState} from 'react';
import styles from './Sidebar.module.css'
import sidebar from "../../store/sidebar";
import {observer} from "mobx-react-lite";
import {Navigation} from "react-minimal-side-navigation";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import api from "../../plugins/axios/api";
import {useNavigate} from "react-router-dom";


const Sidebar = observer(() => {
    let navigate = useNavigate();
    const [categoryHolder, setCategoryHolder] = useState([])

    useEffect(() => {
        api.get('marketplace/category')
            .then((response)=>{
                let testHolder = response.data.map(item => (
                    {
                        title: item.name,
                        itemId: item.id,
                    }
                ))
                setCategoryHolder(testHolder)
            })
        return () => {
        };
    }, []);



    return (
        <div className={sidebar.sidebarIsOpen ? styles.sidebarWrapperActive : styles.sidebarWrapperDisabled}>
         <div className={styles.mainSidebar}>
             <Navigation
                 // you can use your own router's api to get pathname
                 // activeItemId="/management/members"
                 onSelect={({itemId}) => {
                    navigate(`/category/${itemId}`,{replace: true})
                     sidebar.changeSidebarStatus()
                 }}
                 items={categoryHolder}
             />
         </div>
            <div className={styles.sidebarBg}></div>
        </div>
    );
});

export default Sidebar;
