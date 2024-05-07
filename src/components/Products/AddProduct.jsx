import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'components/Common/Button1';
import Form from 'react-bootstrap/Form';

function AddProduct(props) {
    const [product, setProduct] = useState({
        prod_name: '',
        prod_cost: '',
        prod_img: [],
        prod_discount: '',
        prod_end_date_discount: '',
        prod_num_sold: 1,
        prod_num_avai: 50,
        prod_star_rating: '0',
        prod_description: '',
        cate_id: '',
        prod_color: '',
        prod_size: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        setProduct({ ...product, prod_img: files });
    };

    const handleSubmit = () => {
        // Gửi dữ liệu product lên server
        // Cần kiểm tra và xử lý dữ liệu trước khi gửi lên server
        console.log(product);
        // Sau khi gửi xong, đóng popup
        props.onHide();
    };
    const handleBlur = () => {
        if (product.prod_discount === 0 || isNaN(product.prod_discount)) {
            product.prod_discount = 1
        }
    };
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thêm Sản Phẩm Mới
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="prod_name">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control type="text" name="prod_name" placeholder="Tên sản phẩm" value={product.prod_name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="prod_cost">
                        <Form.Label>Giá sản phẩm</Form.Label>
                        <Form.Control type="number" name="prod_cost" placeholder="Giá sản phẩm" value={product.prod_cost} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="prod_discount">
                        <Form.Label>Giảm giá (%)</Form.Label>
                        <Form.Control
                            type="number"
                            name="prod_discount"
                            placeholder="Giảm giá(%)"
                            value={product.prod_discount}
                            onChange={handleChange}
                            min={0}
                            max={100}
                            onBlur={handleBlur()}
                        />
                    </Form.Group>
                    <Form.Group controlId="prod_num_avai">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control type="number" name="prod_num_avai" placeholder="Số lượng còn lại" value={product.prod_num_avai} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="cate_id">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Control as="select" name="cate_id" value={product.cate_id} onChange={handleChange}>
                            <option value="">Chọn danh mục</option>
                            <option value="Vong_co">Vòng cổ</option>
                            <option value="Vong_tay">Vòng tay</option>
                            <option value="Hoa_tai">Hoa tai</option>
                            <option value="Nhan">Nhẫn</option>
                            <option value="Kep">Kẹp</option>
                            <option value="Day_cot_toc">Dây cột tóc</option>
                            <option value="Kep_toc">Kẹp tóc</option>
                            <option value="Cai_toc">Cài tóc</option>
                            <option value="Tram_cai">Trâm cài</option>
                            <option value="Balo">Balo</option>
                            <option value="Tui_xach">Túi xách</option>
                            <option value="Vi">Ví</option>
                            <option value="Giay">Giày</option>
                            <option value="Dep">Dép</option>
                            <option value="Tat">Tất</option>
                            <option value="Thiep">Thiệp</option>
                            <option value="Op_lung">Ốp lưng</option>
                            <option value="Mat_kinh">Mắt kính</option>
                            <option value="Day_deo">Dây đeo</option>
                            <option value="Mu_non">Mũ nón</option>
                            <option value="Khau_trang">Khẩu trang</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="prod_description">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control as="textarea" rows={3} name="prod_description" placeholder="Mô tả" value={product.prod_description} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="prod_color">
                        <Form.Label>Màu sắc</Form.Label>
                        <Form.Control type="text" name="prod_color" placeholder="Màu sắc" value={product.prod_color} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="prod_size">
                        <Form.Label>Kích thước</Form.Label>
                        <Form.Control type="text" name="prod_size" placeholder="Kích thước" value={product.prod_size} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="prod_img">
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control type="file" name="prod_img" onChange={handleImageChange} multiple />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    label="Hủy"
                    labelColor="#785B5B"
                    onClick={props.onHide}
                />
                <Button
                    label="Lưu"
                    labelColor="#F1EFE7"
                    backgroundColor="#785B5B"
                    onClick={handleSubmit}
                />
            </Modal.Footer>
        </Modal>
    );
}

export default AddProduct;
