import React from "react";
import { Button, Modal } from "@nextui-org/react";

export default function ModalWithNext({open, closeHandler, buttonHandler}) {

    const handler = (with_next) => {
        closeHandler();
        buttonHandler(with_next);
    }

    return (
        <Modal open={open} onClose={closeHandler} blur>
            <Button.Group vertical flat>
                <Button onClick={() => handler(false)}>Только текущее</Button>
                <Button onClick={() => handler(true)}>Все последующие</Button>
            </Button.Group>
            <Button css={{m: "0 5px 5px 5px"}} color={"error"} onClick={closeHandler} flat>Отмена</Button>
        </Modal>
    );
}