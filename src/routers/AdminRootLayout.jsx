import { Outlet } from 'react-router-dom';
import Header from 'components/Header';
import SideBar from 'components/SideBar';
import { Container, Row, Col } from 'react-bootstrap';
export default function AdminRootLayout() {
    return (
        <div className='root-layout'>
            {/* <Header /> */}
            <Container fluid style={{padding: '0px'}}>
            <Row>
                <Col lg={2} >
                    <SideBar></SideBar>
                </Col>
                <Col lg={10}>
                <Header></Header>
                <main>
                    <div className="content_rootLayout" >
                        <Outlet />
                    </div>
                </main>
                </Col>
                </Row>
            </Container>
           
            
            

        </div>
    );
}