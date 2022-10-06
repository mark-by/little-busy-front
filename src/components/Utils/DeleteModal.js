import React from "react";
import {Button, Modal, Row, Text} from "@nextui-org/react";

export default function DeleteModal({open, onClose, onDelete}) {
    return (
        <Modal closeButton blur open={open} onClose={onClose} aria-labelledby="modal-title" css={{maxWidth: "95%"}}>
            <Modal.Header>
                <Text id={"modal-title"} h5>Удаление</Text>
            </Modal.Header>
            <Modal.Body>
                <Text>Действительно удалить?</Text>
            </Modal.Body>
            <Modal.Footer>
                <Row justify={"space-around"}>
                    <Button auto onClick={onDelete}>Удалить</Button>
                    <Button auto flat onClick={onClose} color={"error"}>Отмена</Button>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}
