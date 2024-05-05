import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "styles/SideBar.scss";
import { FaUser } from "react-icons/fa";
import { GiBigDiamondRing } from "react-icons/gi";
import { TfiDashboard } from "react-icons/tfi";
import { RiBillLine } from "react-icons/ri";
import { FaRegNewspaper } from "react-icons/fa";

const SideBar = () => {
  return (
    <div className="sidebar">
      <Container className="sidebar_container">
        <Row>
          {" "}
          <h1>TAA admin</h1>{" "}
        </Row>

        <Row className="nav_container">
        <ul>
          <li>
            <NavLink to="/"><TfiDashboard/>Bảng điều khiển</NavLink>
          </li>
          <li>
            <NavLink to="/accounts"><FaUser/> Tài Khoản</NavLink>
          </li>
          <li>
            <NavLink to="/order"> <RiBillLine/> Đơn hàng</NavLink>
          </li>
          <li>
            <NavLink to="/products"> <GiBigDiamondRing/>Sản phẩm</NavLink>
          </li>
          <li>
            <NavLink to="/news"> <FaRegNewspaper/> Bài viết</NavLink>
          </li>
        </ul>
        </Row>
      </Container>
    </div>
  );
};

export default SideBar;
