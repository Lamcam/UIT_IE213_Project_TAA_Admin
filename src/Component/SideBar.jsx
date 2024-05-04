import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'Style/SideBar.scss';

const SideBar = () => {
    return (
        
            <div className="sidebar">
                <Container className='sidebar_container'>
                <Row> <h1>Logo</h1> </Row>

                <Row> 
                    <NavLink>Dashboard</NavLink>
                </Row>
                <Row> 
                    <NavLink>Tài Khoản</NavLink>
                </Row>
                <Row> 
                    <NavLink>Đơn hàng</NavLink>
                </Row>
                <Row> 
                    <NavLink>Sản phẩm</NavLink>
                </Row>
                
                </Container>
            </div>
    );
};

export default SideBar;