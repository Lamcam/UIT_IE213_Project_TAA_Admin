import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
function ModalUpdateOrder(props) {
  const [status, setStatus] = useState(0);
  const [paying, setPaying] = useState(0);

  const styleBtn = {
    backgroundColor: 'rgb(120, 91, 91)',
    border: '1px solid rgb(133, 115, 115)',
  }

  const canBtn = {
    backgroundColor: 'transparent',
    color: 'rgb(120, 91, 91)',
    border: '1px solid rgb(120, 91, 91)',
  }
  const handleChangeStatus = (e) => {
    if (e.target.value === "0") {
      setStatus(0);
    } else {
      setStatus(1);
    }
  }
  const handleChangePaying = (e) => {
    if (e.target.value === "0") {
      setPaying(0);
    } else {
      setPaying(1);
    }
  }
  const handleSubmit = async () => {
    const res = await axios.put(`http://localhost:8000/order/${props.id}`, {
      order_status: status,
      order_is_paying: paying,
    })
    if (res.status === 200) {
      // props.success();
      const item = res.data;
      props.updateValue(item)
      props.onHide();
    }
    else {
      console.log('Có lỗi xảy ra');
    }
    
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Sửa đơn hàng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <h6>Trạng thái giao hàng</h6>
        <Form.Select aria-label="Default select example" defaultValue={props.paying === 'Chưa thanh toán'? 0 : 1 } onChange={handleChangePaying}>
            <option value="0">Chưa giao hàng</option>
            <option value="1">Đã giao hàng</option>
        </Form.Select>
        <h6>Trạng thái thanh toán</h6>
        <Form.Select aria-label="Default select example" defaultValue={props.status === 'Chưa giao hàng' ? 0 : 1  } onChange={handleChangeStatus}>
            <option value="0">Chưa thanh toán</option>
            <option value="1">Đã thanh toán</option>
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button className='modal_can_btn' style={canBtn} onClick={props.onHide}>Hủy</Button>
        <Button className='modal_con_btn' style={styleBtn} onClick={handleSubmit}>Lưu</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalUpdateOrder;
