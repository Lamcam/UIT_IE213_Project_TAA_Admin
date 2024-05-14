import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'components/Common/Button1';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from 'axios';
import 'styles/components/AddNew.scss';

function AddNews(props) {
    const [news, setNews] = useState({
        b_title: '',
        b_date: '',
        b_content: '',
        b_heading: [],
        b_text: [],
        b_image: []
    });

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState(new FormData());
    const [formCompleted, setFormCompleted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNews({ ...news, [name]: value });
        setFormCompleted(false);
    };

    const checkFormCompletion = () => {
        for (const key in news) {
            if (news.hasOwnProperty(key) && !news[key]) {
                return false;
            }
        }
        return formData.getAll('image').length > 0;
    };

    useEffect(() => {
        setFormCompleted(checkFormCompletion());
    }, [news, formData]);

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
            const response = await axios.post('http://localhost:8000/news/upload', formData, {
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
                    news.b_image = urls;
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
            if (news.b_image.length > 0 && uploadedImageUrls) {
                const date = getCurrentDate();
                news.b_date = date;
                await axios.post('http://localhost:8000/news', news)
                    .then((addNewsResponse) => {
                        if (addNewsResponse.status === 201) {
                            console.log(addNewsResponse.data);
                            props.onNewsAdded();
                            props.onHide();
                        } else {
                            console.error('Failed to add news:', addNewsResponse.status);
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to add news:', error);
                    });
            }
        } catch (error) {
            console.error('Error submitting news:', error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const addField = (field) => {
        setNews({ ...news, [field]: [...news[field], ''] });
    };

    const handleFieldChange = (e, field, index) => {
        const { value } = e.target;
        const newFields = [...news[field]];
        newFields[index] = value;
        setNews({ ...news, [field]: newFields });
    };

    const handleRemoveField = (field, index) => {
        const newFields = [...news[field]];
        newFields.splice(index, 1);
        setNews({ ...news, [field]: newFields });
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
            id="ad_addnews"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thêm Tin Tức Mới
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
                        <Form.Group controlId="b_title">
                            <Form.Label>Tiêu đề</Form.Label>
                            <Form.Control type="text" name="b_title" placeholder="Tiêu đề" value={news.b_title} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="b_content">
                            <Form.Label>Nội dung</Form.Label>
                            <Form.Control as="textarea" rows={3} name="b_content" placeholder="Nội dung" value={news.b_content} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="b_heading">
                            <Form.Label>Tiêu đề phụ</Form.Label>
                            {news.b_heading.map((heading, index) => (
                                <div key={index} className="dynamic-field">
                                    <Form.Control type="text" value={heading} onChange={(e) => handleFieldChange(e, 'b_heading', index)} placeholder="Tiêu đề phụ" />
                                    <Button label="Xóa" onClick={() => handleRemoveField('b_heading', index)} />
                                </div>
                            ))}
                            <Button label="Thêm tiêu đề phụ" onClick={() => addField('b_heading')} />
                        </Form.Group>
                        <Form.Group controlId="b_text">
                            <Form.Label>Nội dung phụ</Form.Label>
                            {news.b_text.map((text, index) => (
                                <div key={index} className="dynamic-field">
                                    <Form.Control as="textarea" rows={2} value={text} onChange={(e) => handleFieldChange(e, 'b_text', index)} placeholder="Nội dung phụ" />
                                    <Button label="Xóa" onClick={() => handleRemoveField('b_text', index)} />
                                </div>
                            ))}
                            <Button label="Thêm nội dung phụ" onClick={() => addField('b_text')} />
                        </Form.Group>
                        <Form.Group controlId="b_image">
                            <Form.Label>Hình ảnh</Form.Label>
                            <Form.Control type="file" name="b_image" onChange={handleImageChange} multiple />
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

export default AddNews;
