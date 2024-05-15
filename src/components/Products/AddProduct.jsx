import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'components/Common/Button1';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from 'axios';
import 'styles/components/AddProduct.scss';

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
        cate_name: '',
        prod_color: '',
        prod_size: '',
    });

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState(new FormData());
    const [errors, setErrors] = useState({});
    const [formCompleted, setFormCompleted] = useState(false);
    const [isProductCreated, setIsProductCreated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
        setFormCompleted(false);
    };

    const checkFormCompletion = () => {
        for (const key in product) {
            if (key !== 'prod_discount' || (key === 'prod_discount' && product[key] !== 0)) {
                if (product.hasOwnProperty(key) && !product[key]) {
                    return false;
                }
            }
        }
        return formData.getAll('image').length > 0;
    };

    useEffect(() => {
        setFormCompleted(checkFormCompletion());
    }, [product, formData]);

    const handleImageChange = (e) => {
        const files = e.target.files;
        const newFormData = new FormData();

        for (let i = 0; i < files.length; i++) {
            newFormData.append('image', files[i]);
        }

        setFormData(newFormData);
    };

    const uploadImages = async () => {
        try {
            const response = await axios.post('http://localhost:8000/products/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            if (response.status === 200) {
                const urls = response.data.urls;
                if (urls) {
                    product.prod_img = urls;
                }
                return urls;
            } else {
                console.error('Failed to upload images:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        setUploading(true);
        setUploadProgress(0);

        const simulateProgress = () => {
            setTimeout(() => setUploadProgress(10), 1000);
            setTimeout(() => setUploadProgress(20), 2000);
            setTimeout(() => setUploadProgress(40), 3000);
            setTimeout(() => setUploadProgress(50), 4000);
            setTimeout(() => setUploadProgress(60), 5000);
            setTimeout(() => setUploadProgress(75), 6000);
            setTimeout(() => setUploadProgress(80), 7000);
            setTimeout(() => setUploadProgress(90), 8000);
            setTimeout(() => setUploadProgress(100), 9000);
        };

        simulateProgress();

        try {
            const uploadedImageUrls = await uploadImages();
            setIsProductCreated(true);
            if (product.prod_img.length > 0 && uploadedImageUrls) {
                const discountPercentage = product.prod_discount / 100;
                product.prod_discount = discountPercentage;
                await axios.post('http://localhost:8000/products', product)
                    .then((addProductResponse) => {
                        if (addProductResponse.status === 201) {
                            console.log(addProductResponse.data);
                            props.onProductAdded();
                            props.onHide();
                        } else {
                            console.error('Failed to add product:', addProductResponse.status);
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to add product:', error);
                    });
            }
        } catch (error) {
            console.error('Error submitting product:', error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };
    const handleBlurNumber = () => {
        let numberAvai = parseFloat(product.prod_num_avai);

        if (isNaN(numberAvai) || numberAvai < 0) {
            numberAvai = 1;
        }

        setProduct({ ...product, prod_num_avai: numberAvai });
    };

    const handleBlurPrice = () => {
        let numberAvai = parseFloat(product.prod_cost);

        if (isNaN(numberAvai) || numberAvai < 0) {
            numberAvai = 1;
        }

        setProduct({ ...product, prod_cost: numberAvai });
    };


    const handleBlur = () => {
        let discount = parseFloat(product.prod_discount);

        if (isNaN(discount) || discount < 0) {
            discount = 0;
        } else if (discount > 100) {
            discount = 100;
        }

        setProduct({ ...product, prod_discount: discount });
    };
    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            id="ad_addproduct"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thêm Sản Phẩm Mới
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {uploading ? (
                    <div className="loading-message">
                        <p>Đang xử lý...</p>
                        <ProgressBar animated now={uploadProgress} label={`${uploadProgress}%`} />
                    </div>
                ) : (
                    <Form>
                        <Form.Group controlId="prod_name">
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Form.Control type="text" name="prod_name" placeholder="Tên sản phẩm" value={product.prod_name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="prod_cost">
                            <Form.Label>Giá sản phẩm</Form.Label>
                            <Form.Control
                                type="number"
                                name="prod_cost"
                                placeholder="Giá sản phẩm"
                                min="0"
                                value={product.prod_cost}
                                onChange={handleChange}
                                onBlur={handleBlurPrice}
                            />
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
                            <Form.Control type="date"
                                min={getCurrentDate()}
                                name="prod_end_date_discount" value={product.prod_end_date_discount} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="prod_num_avai">
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                name="prod_num_avai"
                                min="0"
                                placeholder="Số lượng còn lại"
                                value={product.prod_num_avai}
                                onChange={handleChange}
                                onBlur={handleBlurNumber}
                            />
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
                )}
            </Modal.Body>
            {!uploading && (
                <Modal.Footer>
                    <Button
                        label="Hủy"
                        labelColor="#785B5B"
                        onClick={props.onHide}
                    />
                    <Button
                        label="Lưu"
                        labelColor={formCompleted ? "#F1EFE7" : "#999797"}
                        border={formCompleted ? "1px solid #785B5B" : 'none'}
                        backgroundColor={formCompleted ? "#785B5B" : "#e3e3e4"}
                        onClick={handleSubmit}
                        disabled={!formCompleted}
                    />
                </Modal.Footer>
            )}
        </Modal>
    );
}

export default AddProduct;
