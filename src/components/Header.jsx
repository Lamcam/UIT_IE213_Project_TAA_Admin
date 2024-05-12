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
            <Col lg={12}>
            <Row className='header_wrapper'>
                <Col lg={4}>
                    <h1>Admin Panel</h1>
                </Col>

                <Col lg={4}>       
                    <div className="user-info">
                        <FaRegBell />
                        {/* <p>Xin chào Solari</p> */}
                        <h5>Xin chào Admin</h5>
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