import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "styles/SideBar.scss";

const SideBar = () => {
  return (
    <div className="sidebar">
      <Container className="sidebar_container">
        <Row>
          {" "}
          <h1>TAA admin</h1>{" "}
        </Row>
        <ul>
          <li>
            <NavLink to="/">Bảng điều khiển</NavLink>
          </li>
          <li>
            <NavLink to="/accounts">Tài Khoản</NavLink>
          </li>
          <li>
            <NavLink to="/order">Đơn hàng</NavLink>
          </li>
          <li>
            <NavLink to="/products">Sản phẩm</NavLink>
          </li>
          <li>
            <NavLink to="/news">Bài viết</NavLink>
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default SideBar;
