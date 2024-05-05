import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import { FaRegBell } from "react-icons/fa";
import AccountSection from './Avatar';
import 'styles/Header.scss';

const Header = () => {
    return (
        <header>
            <Container className='header_container'>
            <Row>
            <Col lg={3}>
                <div className='logo'>
                    <h1>Admin</h1>
                </div>
            </Col>

            <Col lg={8}>
            <Row className='header_wrapper'>
                <Col>
                    <h1>Admin Panel</h1>
                </Col>

                <Col>       
                    <div className="user-info">
                        <FaRegBell />
                        <p>Hello Solari</p>
                        <AccountSection></AccountSection>
                    </div>
                </Col>
            </Row>
            </Col>
            </Row>
            </Container>
        </header>
    );
};

export default Header;