import React from 'react';
import { Navbar, Container, Offcanvas, Nav, Form, Button, FormControl } from 'react-bootstrap';
import styles from './Header.module.scss';
import calendar from '../assets/header/calendar.svg'; 
import gearshape from '../assets/header/gearshape.svg';
import person from '../assets/header/person.svg';
import store from '../assets/header/store.svg';

export const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.header_wrapper}>
        <Navbar className={styles.Navbar} collapseOnSelect expand={false}>
            <Container fluid>
              <Navbar.Toggle className="main_nav_button" aria-controls="offcanvasNavbar" />
              <Navbar.Brand
                title="Вернуться на главную"
                className="main_logo_div"
              >
                <div className={styles.main_logo_div_smallV2}>
                  Every Services<span></span>
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
               <div className='d-flex justify-content-center'><span className={styles.icon_calendar} style={{backgroundImage: `url(${calendar})`}}></span></div>
                <div>
                  Записи
                </div>
              </div>
              <div className={`me-4 ${styles.nav_store}`}>
                <div className='d-flex justify-content-center'><span className={styles.icon_calendar} style={{backgroundImage: `url(${person})`}}></span></div>
                <div>
                  Клиенты
                </div>
              </div>
              <div className={`me-2 ${styles.nav_store}`}>
                <div className='d-flex justify-content-center'><span className={styles.icon_calendar} style={{backgroundImage: `url(${store})`}}></span></div>
                <div>
                  Магазины
                </div>
              </div>
        </div>
      </div>
    </div>
  )
}

