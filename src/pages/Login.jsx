import {Form, Image, Button } from 'react-bootstrap';
import {Col, Container} from 'react-bootstrap';
// import logo from 'assets/image/logo2.svg';
import 'styles/pages/Login.scss';
import { useState } from 'react';
import { useLogIn } from 'hooks/useLogin';
function Login() {
  const { logIn } = useLogIn();
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    logIn(username, password);
    // console.log(username, password);
  }

  const handleChangeEmail = (e) => {
      setEmail(e.target.value);
  }
  const handleChangePassword = (e) => {
      setPassword(e.target.value);
  }
    

  return (
    <section className="login">
    <Container className='d-flex login_container' fluid='lg'>
      <Col className='login_form col-8'>
        <h1> Đăng nhập Admin TAA </h1>
        <Form>
          <Form.Group className="mb-3 input" controlId="formBasicEmail">
              <Form.Control type="email" name='email' placeholder="Điền email" onChange={handleChangeEmail} />
              <Form.Text className="text-muted">
              </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 input" controlId="formBasicPassword">
              <Form.Control type="password" name='password' placeholder="Mật khẩu" onChange={handleChangePassword} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <h6 className='forgot_pass'>Bạn quên mật khẩu ?</h6>
          </Form.Group>

          
          <div className="d-grid gap-2">
            <Button className='login_btn' size='lg' onClick={handleSubmit}>
              Đăng nhập
            </Button>
            
          </div>

        </Form>
      </Col>

    </Container>
    </section>
  );
}

export default Login;