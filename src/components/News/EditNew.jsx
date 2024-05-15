import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'components/Common/Button1';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from 'axios';
import 'styles/components/EditNew.scss';

function EditNew(props) {
    const [initialNews, setInitialNews] = useState({});
    const [news, setNews] = useState({
        b_title: '',
        b_date: '',
        b_content: '',
        b_heading: ['', '', ''],
        b_text: ['', '', ''],
        b_image: []
    });

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState(new FormData());
    const [formCompleted, setFormCompleted] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/news/${props.newId}`)
            .then((res) => {
                const newsData = {
                    b_title: res.data.b_title,
                    b_date: res.data.b_date,
                    b_content: res.data.b_content,
                    b_heading: res.data.b_heading,
                    b_text: res.data.b_text,
                    b_image: res.data.b_image,
                };
                setNews(newsData);
                setInitialNews(newsData);
            })
            .catch((err) => {
                console.error('Error fetching news details:', err);
            });
    }, [props.newId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNews({ ...news, [name]: value });
    };

    const handleFieldChange = (e, field, index) => {
        const { value } = e.target;
        const newFields = [...news[field]];
        newFields[index] = value;
        setNews({ ...news, [field]: newFields });
    };

    const checkFormCompletion = () => {
        if (!news.b_title || !news.b_content) {
            return false;
        }

        for (let i = 0; i < news.b_heading.length; i++) {
            if (!news.b_heading[i]) {
                return false;
            }
        }

        for (let i = 0; i < news.b_text.length; i++) {
            if (!news.b_text[i]) {
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
        setIsFileSelected(true);
    };

    const simulateProgress = () => {
        setTimeout(() => setUploadProgress(10), 1000);
        setTimeout(() => setUploadProgress(20), 2000);
        setTimeout(() => setUploadProgress(40), 4000);
        setTimeout(() => setUploadProgress(50), 5000);
        setTimeout(() => setUploadProgress(60), 6000);
        setTimeout(() => setUploadProgress(75), 7000);
        setTimeout(() => setUploadProgress(80), 8000);
        setTimeout(() => setUploadProgress(85), 9000);
        setTimeout(() => setUploadProgress(90), 11000);
        setTimeout(() => setUploadProgress(95), 12000);
        setTimeout(() => setUploadProgress(100), 13000);
    };

    const uploadImages = async () => {
        setUploading(true);
        simulateProgress();
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
        try {
            let urls = [];
            if (isFileSelected) {
                urls = await uploadImages(formData);
                setUploading(false)
                while (urls.length === 0) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Đợi 100ms
                }
            }
            const updatedNews = {
                b_title: news.b_title,
                b_date: news.b_date,
                b_content: news.b_content,
                b_heading: news.b_heading,
                b_text: news.b_text,
                b_image: urls.length > 0 ? urls : news.b_image // Sử dụng các URLs đã được tải lên
            };

            await axios.put(`http://localhost:8000/news/${props.newId}`, updatedNews)
                .then((editNewsResponse) => {
                    if (editNewsResponse.status === 200) {
                        console.log(editNewsResponse.data);
                        props.onNewUpdated();
                        props.onHide();
                        setIsFileSelected(false);
                    } else {
                        console.error('Failed to edit news:', editNewsResponse.status);
                    }
                })
                .catch((error) => {
                    console.error('Failed to edit news:', error);
                });
        } catch (error) {
            console.error('Error submitting news:', error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    useEffect(() => {
        const isFormValid = (
            news.b_title !== initialNews.b_title ||
            news.b_content !== initialNews.b_content ||
            JSON.stringify(news.b_heading) !== JSON.stringify(initialNews.b_heading) ||
            JSON.stringify(news.b_text) !== JSON.stringify(initialNews.b_text) ||
            isFileSelected
        );
        console.log(news.b_title !== initialNews.b_title,
            news.b_content !== initialNews.b_content,
            JSON.stringify(news.b_heading) !== JSON.stringify(initialNews.b_heading),
            JSON.stringify(news.b_text) !== JSON.stringify(initialNews.b_text),
            isFileSelected)
        setFormCompleted(isFormValid);
    }, [news, isFileSelected, initialNews]);



    // const hasChanges = () => {
    //     if (!initialNews) return false;
    //     return JSON.stringify(initialNews) !== JSON.stringify(news);
    // };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            id="ad_editnew"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Chỉnh sửa bài viết
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        {news.b_heading?.map((heading, index) => (
                            <Form.Control
                                key={index}
                                type="text"
                                value={heading}
                                onChange={(e) => handleFieldChange(e, 'b_heading', index)}
                                placeholder={`Tiêu đề phụ ${index + 1}`}
                                className="subfield-spacing"
                            />
                        ))}
                    </Form.Group>
                    <Form.Group controlId="b_text">
                        <Form.Label>Nội dung phụ</Form.Label>
                        {news.b_text?.map((text, index) => (
                            <Form.Control
                                key={index}
                                as="textarea"
                                rows={2}
                                value={text}
                                onChange={(e) => handleFieldChange(e, 'b_text', index)}
                                placeholder={`Nội dung phụ ${index + 1}`}
                                className="subfield-spacing"
                            />
                        ))}
                    </Form.Group>
                    <Form.Group controlId="b_image">
                        <Form.Label>Hình ảnh</Form.Label>
                        <div className="image-upload">
                            {news.b_image?.length > 0 && !isFileSelected && (
                                <div className="new-image">
                                    <img src={news.b_image[0]} alt="new image" />
                                </div>
                            )}
                            <Form.Control type="file" name="b_image" onChange={handleImageChange} multiple />
                        </div>
                        {uploading && (
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
                    label="Lưu"
                    labelColor={formCompleted ? "#F1EFE7" : "#999797"}
                    border={formCompleted ? "1px solid #785B5B" : '1px solid #E3E3E4'}
                    backgroundColor={formCompleted ? "#785B5B" : "#e3e3e4"}
                    onClick={handleSubmit}
                    disabled={!formCompleted}
                />
            </Modal.Footer>
        </Modal>
    );
}

export default EditNew;
