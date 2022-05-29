import React, {useEffect, useState} from 'react';
import {
    Form,
    Button,
    Container,
    FormControl,
    InputGroup,
    Modal,
    Navbar,
    NavItem,
    DropdownButton,
    Dropdown,
    Badge, OverlayTrigger, Popover
} from "react-bootstrap";
import {List, Search} from "react-bootstrap-icons";
import './Header.css'
import {useNavigate, useSearchParams} from "react-router-dom";
import sidebar from "../store/sidebar";
import api from "../plugins/axios/api";
import {useCookies,Cookies} from "react-cookie";
import {observer} from "mobx-react-lite";
import user from '../store/user'
import cart from "../store/cart";
import AuthModal from "./AuthModal/AuthModal";

const Header = observer(() => {
    const [cookies] = useCookies(['token','isAuth','userData','userCity']);
    let navigate = useNavigate()
    let [searchHolder,setSearchHolder] = useState('')
    let [cityVar,setCityVar] = useState([])

useEffect(()=>{
    api('marketplace/city/')
        .then((response)=>{
            setCityVar(response.data)
        })
},[])
//TODO сделать привязку по городу (спб, новгород)



     function goToSearch(e){
        console.log(e)
        if(searchHolder === '') {return}
        else if ((e.type="keypress" && e.code==='Enter') || e._reactName === 'onClick')
         navigate(`/search/?q=${searchHolder}`)
     }
    async function unAuthUser(){
        await user.unAuthUser()
        await navigate('/')
        await navigate(0)
    }
    async function changeCity(city){
       await user.setUserCity(city)
        await navigate(0)
    }


    return (
        <div>
            <Navbar className={'additionalNavBlock'} bg="light">

                <OverlayTrigger
                    trigger="click"
                    placement={'bottom'}
                    overlay={
                        <Popover id={`popover-positioned-bottom`}>
                            <Popover.Header as="h3">{`Выбор города`}</Popover.Header>
                            <Popover.Body>
                                {cityVar.map((city)=>(
                                    <div key={city.name} onClick={()=>{changeCity(city)}}>{city.name}</div>
                                ))}
                            </Popover.Body>
                        </Popover>
                    }
                >
                    <p className={'chosenCity'}>{cookies.userCity?.name}</p>
                </OverlayTrigger>
            </Navbar>
        <Navbar bg="light">
            <Container>
                <Navbar.Brand className={'navbar-brand'} ><span onClick={()=>{navigate('/')}}>STROYROOM</span>
                    <Button onClick={()=>{sidebar.changeSidebarStatus()}} className={'sidebar-button'}><List></List> Каталог</Button>

                </Navbar.Brand>

                {user.authModal &&
                    <AuthModal></AuthModal>
                }
                <NavItem>
<div className={'rightNavbar'}>
                    <InputGroup>
                        <FormControl
                            placeholder="Поиск"
                            aria-label="Поиск"
                            onKeyPress={(e)=>{goToSearch(e)}}
                            aria-describedby="basic-addon1"
                            onChange={(event)=>{setSearchHolder(event.target.value)}}
                        />
                        <Button
                            className={'search-btn qwe'}
                            variant="outline-secondary"
                            title="Action"
                            id="button"
                            disabled={searchHolder === ''}
                            onClick={goToSearch}
                        >
                            <Search></Search>
                        </Button>
                    </InputGroup>
    { cookies.isAuth === (false || undefined) &&
<Button onClick={()=>{user.showAuthModal(true)}} >Войти</Button>
    }
    { cookies.isAuth === 'true' &&
        <div className={'nav-buttons'}>
        <Button disabled={cart.itemsAmount === 0} onClick={()=>{navigate('/cart')}} className={'cart-button'}><span>Корзина</span> <Badge  bg="secondary">{cart.itemsAmount}</Badge></Button>
        <DropdownButton id="dropdown-basic-button" title={'Профиль'}>
        <Dropdown.Item onClick={()=>{navigate('/orders')}}>Мои заказы</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Настройки</Dropdown.Item>
        <Dropdown.Item  className={'exit-button'} onClick={unAuthUser}>Выйти</Dropdown.Item>
        </DropdownButton>
        </div>
    }
</div>
                </NavItem>
            </Container>



        </Navbar>
        </div>
    );
});

export default Header;
