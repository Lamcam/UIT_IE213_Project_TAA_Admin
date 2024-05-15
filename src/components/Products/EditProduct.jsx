import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'components/Common/Button1';
import 'styles/components/EditProduct.scss';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';

const EditProduct = (props) => {
    const [product, setProduct] = useState({});
    const [tempPrice, setTempPrice] = useState('');
    const [tempDiscount, setTempDiscount] = useState('');
    const [discountEndDate, setDiscountEndDate] = useState('');
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [isLoadImg, setIsLoadImg] = useState(false);
    const [initialProduct, setInitialProduct] = useState({});
    const [formData, setFormData] = useState(new FormData());
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:8000/products/cate/${props.productId}`)
            .then((res) => {
                const infoProduct = {
                    ...res.data,
                    cate_name: res.data.cate_id?.cate_name,
                    firstImageProduct: res.data.prod_img?.[0],
                };
                setProduct(infoProduct);
                setInitialProduct(infoProduct);
                setTempPrice(formatPrice(res.data.prod_cost?.$numberDecimal));
                setTempDiscount(res.data.prod_discount?.$numberDecimal * 100);
                if (res.data.prod_end_date_discount) {
                    setDiscountEndDate(new Date(res.data.prod_end_date_discount).toISOString().split('T')[0]);
                }
            })
            .catch((err) => {
                console.error('Error fetching product details:', err);
            });
    }, [props.productId]);

    const formatPrice = (price) => {
        const priceNumber = parseFloat(price);
        let formattedPrice = priceNumber.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
        formattedPrice = formattedPrice.replace(/\./g, ''); // Loại bỏ tất cả dấu chấm
        return formattedPrice;
    };


    const handleImageChange = async (e) => {
        const files = e.target.files;
        const newFormData = new FormData();

        for (let i = 0; i < files.length; i++) {
            newFormData.append('image', files[i]);
        }

        setIsFileSelected(true);
        setFormData(newFormData)

        // try {
        //     const urls = await uploadImages(newFormData);
        //     setUrlsImg(urls);
        // } catch (error) {
        //     console.error('Error uploading images:', error);
        // }
    };
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
    const uploadImages = async (formData) => {
        setIsLoadImg(true);
        simulateProgress();
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

    const handleSave = async () => {
        try {
            let urls = [];
            if (isFileSelected) {
                urls = await uploadImages(formData);
                setIsLoadImg(false);
                while (urls.length === 0) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Đợi 100ms
                }
            }
            const updatedProduct = {
                prod_name: product.prod_name,
                prod_cost: tempPrice || product.prod_cost,
                prod_discount: (tempDiscount / 100).toString() || product.prod_discount,
                prod_end_date_discount: discountEndDate || product.prod_end_date_discount,
                prod_num_sold: product.prod_num_sold,
                prod_num_avai: product.prod_num_avai,
                prod_star_rating: product.prod_star_rating,
                prod_description: product.prod_description,
                prod_img: urls.length ? urls : product.prod_img,
                cate_name: product.cate_name,
                prod_color: product.prod_color,
                prod_size: product.prod_size,
            };

            console.log(updatedProduct);
            await axios.put(`http://localhost:8000/products/${product._id}`, updatedProduct)
                .then((editProductResponse) => {
                    if (editProductResponse.status === 200) {
                        console.log(editProductResponse.data);
                        props.onProductUpdated();
                        props.onHide();
                        setIsFileSelected(false);
                    } else {
                        console.error('Failed to add product:', editProductResponse.status);
                    }
                })
                .catch((error) => {
                    console.error('Failed to add product:', error);
                });


            // props.onHide(); // Close the modal after saving
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleDiscountEndDateChange = (e) => {
        setDiscountEndDate(e.target.value);
    };

    const handleTempPriceChange = (e) => {
        setTempPrice(e.target.value);
    };

    const handleTempDiscountChange = (e) => {
        setTempDiscount(e.target.value);
    };
    const handleBlur = () => {
        let discount = parseFloat(tempDiscount);

        if (isNaN(discount) || discount < 0) {
            discount = 0;
        } else if (discount > 100) {
            discount = 100;
        }

        setTempDiscount(discount)
    };
    useEffect(() => {
        const isFormValid = (
            product.prod_name !== initialProduct.prod_name ||
            tempPrice.trim() !== formatPrice(initialProduct.prod_cost?.$numberDecimal) ||
            tempDiscount !== initialProduct.prod_discount?.$numberDecimal * 100 ||
            discountEndDate !== new Date(initialProduct.prod_end_date_discount).toISOString().split('T')[0] ||
            product.cate_name !== initialProduct.cate_name ||
            product.prod_num_avai.toString() !== initialProduct.prod_num_avai.toString() ||
            product.prod_description !== initialProduct.prod_description ||
            product.prod_color !== initialProduct.prod_color ||
            product.prod_size !== initialProduct.prod_size ||
            isFileSelected
        );


        setIsFormChanged(isFormValid);
    }, [product, tempPrice, tempDiscount, discountEndDate, isFileSelected, initialProduct]);
    return (
        <Modal size="lg" show={props.show} onHide={props.onHide} id="ad_editproduct">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa thông tin sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="prod_name">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control type="text" name="prod_name" placeholder="Tên sản phẩm" value={product.prod_name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="prod_cost">
                        <Form.Label>Giá sản phẩm</Form.Label>
                        <Form.Control type="number" name="prod_cost" placeholder="Giá sản phẩm" value={tempPrice} onChange={handleTempPriceChange} min="0" />
                    </Form.Group>
                    <Form.Group controlId="prod_discount">
                        <Form.Label>Giảm giá (%)</Form.Label>
                        <Form.Control type="number" name="prod_discount" placeholder="Giảm giá(%)" value={tempDiscount} onChange={handleTempDiscountChange} min={0} max={100} onBlur={handleBlur} />
                    </Form.Group>
                    <Form.Group controlId="prod_end_date_discount">
                        <Form.Label>Ngày kết thúc giảm giá</Form.Label>
                        <Form.Control type="date" name="prod_end_date_discount" value={discountEndDate} onChange={handleDiscountEndDateChange} />
                    </Form.Group>
                    <Form.Group controlId="prod_num_avai">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control type="number" name="prod_num_avai" placeholder="Số lượng còn lại" value={product.prod_num_avai} onChange={handleChange} min="0" />
                    </Form.Group>
                    <Form.Group controlId="cate_name">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Control as="select" name="cate_name" value={product.cate_name} onChange={handleChange}>
                            <option value="">Chọn danh mục</option>
                            {/* Thêm các danh mục khác vào đây */}
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
                        <div className="image-upload">
                            {product.firstImageProduct && !isFileSelected && (
                                <div className="product-image">
                                    <img src={product.firstImageProduct} alt="Product" />
                                </div>
                            )}
                            <Form.Control type="file" name="prod_img" onChange={handleImageChange} multiple />
                        </div>
                        {isLoadImg && (
                            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                        )}
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
                    label="Cập nhật"
                    labelColor={isFormChanged ? "#F1EFE7" : "#999797"}
                    border={isFormChanged ? "1px solid #785B5B" : '1px solid #E3E3E4'}
                    backgroundColor={isFormChanged ? "#785B5B" : "#e3e3e4"}
                    onClick={handleSave}
                    disabled={!isFormChanged}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default EditProduct;
