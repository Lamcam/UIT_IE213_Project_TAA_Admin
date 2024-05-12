import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'components/Common/Button1';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function AddProduct(props) {
    const [product, setProduct] = useState({
        prod_name: '',
        prod_cost: '',
        // prod_img: ["https://res.cloudinary.com/dg40uppx3/image/upload/v1712908580/products/vong_co/vong_co_2-1_qpxwy4.jpg",
        //     "https://res.cloudinary.com/dg40uppx3/image/upload/v1712908579/products/vong_co/vong_co_2-2_wocjqq.jpg",
        //     "https://res.cloudinary.com/dg40uppx3/image/upload/v1712908578/products/vong_co/vong_co_2-3_yyygvh.jpg",
        //     "https://res.cloudinary.com/dg40uppx3/image/upload/v1712908579/products/vong_co/vong_co_2-4_lmoz6d.jpg",
        //     "https://res.cloudinary.com/dg40uppx3/image/upload/v1712908578/products/vong_co/vong_co_2-5jfif_vdrxwm.jpg",
        //     "https://res.cloudinary.com/dg40uppx3/image/upload/v1712908580/products/vong_co/vong_co_2-1_qpxwy4.jpg"],
        prod_img: [],
        prod_discount: '',
        prod_end_date_discount: '',
        prod_num_sold: 1,
        prod_num_avai: 50,
        prod_star_rating: '0',
        prod_description: '',
        cate_name: '',
        prod_color: '',
        prod_size: '',
    });
    const [imageList, setImageList] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // const handleImageChange = (e) => {
    //     const files = e.target.files;

    //     // Khởi tạo một mảng để lưu trữ các đối tượng File
    //     const fileList = [];

    //     // Lặp qua từng file trong FileList và thêm vào mảng fileList
    //     for (let i = 0; i < files.length; i++) {
    //         fileList.push(files[i]);
    //     }

    //     // Cập nhật trường prod_img trong state product với mảng fileList
    //     setProduct({ ...product, prod_img: fileList });
    // };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const urls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (event) => {
                urls.push(event.target.result);
                if (urls.length === files.length) {
                    setImageList(urls);
                }
            };

            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async () => {
        try {
            setProduct({ ...product, prod_img: imageList })

            console.log("product", product)

            const response = await axios.post('http://localhost:8000/products', product);

            // Kiểm tra mã trạng thái của phản hồi
            if (response.status === 200) {
                // Phản hồi thành công, xử lý dữ liệu phản hồi nếu cần
                console.log(response.data);
                // Sau khi gửi xong, đóng popup
                props.onHide();
            } else {
                // Xử lý lỗi nếu có
                console.error('Failed to submit product:', response.status);
            }
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };


    const handleBlur = () => {
        // Kiểm tra xem prod_discount có giá trị và không phải là NaN
        if (product.prod_discount !== '' && !isNaN(product.prod_discount)) {
            // Chuyển đổi giá trị prod_discount thành số và chia cho 100 để đưa về dạng phần trăm
            const discountPercentage = parseFloat(product.prod_discount) / 100;
            // Cập nhật giá trị prod_discount trong state với định dạng số thực
            setProduct({ ...product, prod_discount: discountPercentage });
        } else {
            // Nếu giá trị không hợp lệ, set giá trị prod_discount thành 0
            setProduct({ ...product, prod_discount: 0 });
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
                            onBlur={handleBlur}
                        />
                    </Form.Group>
                    <Form.Group controlId="prod_end_date_discount">
                        <Form.Label>Ngày kết thúc giảm giá</Form.Label>
                        <Form.Control type="date" name="prod_end_date_discount" value={product.prod_end_date_discount} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="prod_num_avai">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control type="number" name="prod_num_avai" placeholder="Số lượng còn lại" value={product.prod_num_avai} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="cate_name">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Control as="select" name="cate_name" value={product.cate_name} onChange={handleChange}>
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
