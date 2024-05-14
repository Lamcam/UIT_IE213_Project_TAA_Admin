import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'components/Common/Button1';

const DeleteConfirmationPopup = (props) => {
    return (
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.body}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={props.onHide}
                    label="Huỷ"
                    labelColor="#785B5B"
                />
                <Button
                    onClick={props.onConfirm}
                    label="Xác nhận"
                    labelColor="#F1EFE7"
                    backgroundColor="#785B5B"
                />
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationPopup;
