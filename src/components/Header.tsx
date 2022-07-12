import React, { useEffect } from 'react';
import { Navbar, Container, Offcanvas, Nav, Form, Button, FormControl } from 'react-bootstrap';
import styles from './Header.module.scss';
import location from '../assets/header/location.svg'; 
import person from '../assets/header/person_2.svg';
import busket from '../assets/header/busket.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCityAsync } from '../store/addressSlice';

export const Header = () => {
  const dispatch = useDispatch()
  const {cityES} = useSelector((state:any)=> state.address)
  const {count_basket} = useSelector((state:any)=> state.prood)
  const nav = useNavigate()
  useEffect(() => {
    dispatch(getCityAsync())
  }, [])
  
  return (
    <>
    {Object.keys(cityES).length > 0 ?
    <div className={styles.city}>
      <div className={styles.city_wrapper}><div style={{backgroundImage: `url(${location})`, width: '20px', height: '20px'}}></div><span>{cityES[0]?.name}</span>
      </div>
    </div> :<></>}
    <div className={styles.header}>
      <div className={styles.header_wrapper}>
        <Navbar className={styles.Navbar} collapseOnSelect expand={false}>
            <Container fluid>
              <Navbar.Toggle className="main_nav_button" aria-controls="offcanvasNavbar" />
              <Navbar.Brand
                title="Вернуться на главную"
                className="main_logo_div"
              >
                <div onClick={()=>nav('/')} className={styles.main_logo_div_smallV2}>
                  <div className={styles.dekstop}>Every Services</div><span className={styles.mobile}>ES</span>
                </div>
              </Navbar.Brand>
              <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="start"
                collapseOnSelect
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title style={{ color: 'black' }} id="offcanvasNavbarLabel">
                    Every Services
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3 ">
                          <Nav.Link
                            data-bs-dismiss="offcanvas"
                            href="#"
                            style={{ color: 'black' }}
                            onClick={() => {
                            }}
                          >
                            Главная 
                          </Nav.Link>
                  </Nav>
                  <Form className="d-flex mt-2">
                    <FormControl
                      type="search"
                      placeholder="Поиск"
                      className="me-2"
                      aria-label="Search"

                    />
                    <Button
                      onClick={() =>
                        alert('поиск')
                      }
                      variant="outline-success"
                    >
                      Поиск
                    </Button>
                  </Form>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
        </Navbar>
        <div className={styles.block_width_navigation}>
              <div className={`me-4 ${styles.nav_store}`}>
               <div onClick={()=>nav('/address')} className='d-flex justify-content-center'><span className={styles.icon_calendar} style={{backgroundImage: `url(${location})`}}></span></div>
                <div>
                  Адресса
                </div>
              </div>
              <div className={`me-4 ${styles.nav_store}`}>
                <div onClick={()=>nav('/auth')} className='d-flex justify-content-center'><span className={styles.icon_calendar} style={{backgroundImage: `url(${person})`}}></span></div>
                <div>
                  Войти
                </div>
              </div>
              <div className={`me-2 ${styles.nav_store}`}>
               <div className={styles.basket_count}><span>{count_basket}</span></div>
                <div onClick={()=>nav('/basket')} className='d-flex justify-content-center'><span className={styles.icon_busket} style={{backgroundImage: `url(${busket})`}}></span></div>
                <div className={styles.basket_title}>
                  Корзина
                </div>
              </div>
        </div>
      </div>
    </div>
  </>
  )
}

