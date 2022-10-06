import React from "react";
import {Button, Input, Modal, Row, Spacer, Text, useInput} from "@nextui-org/react";
import axios from "axios";
import {API} from "../../network/api";
import {toast} from "react-hot-toast";

export default function ModalCreateClient({open, onClose, onCreate}) {
    const name = useInput("");
    const tel = useInput(null);

    const closeHandler = () => {
        onClose();
        name.reset();
        tel.reset();
    }

    const createHandler = () => {
        axios.post(API.customers, {name: name.value, tel: tel.value})
            .then(resp => {
                toast.success("Клиент создан");
                onCreate(resp.data);
                closeHandler();
            })
            .catch(err => {
                toast.error("что-то пошло не так");
            })
    }

    return (
        <Modal open={open} closeButton blur aria-labelledby="modal-title" onClose={closeHandler}>
            <Modal.Header>
                <Text id="modal-title" size={18}>Создание клиента</Text>
            </Modal.Header>
            <Modal.Body>
                <Input
                    clearable
                    bordered
                    fullWidth
                    color="primary"
                    size="md"
                    aria-label={"name"}
                    placeholder="Имя"
                    {...name.bindings}
                />
                <Input
                    clearable
                    bordered
                    fullWidth
                    color="primary"
                    size="md"
                    aria-label={"tel"}
                    placeholder="Телефон"
                    labelLeft={"+7"}
                    helperText={"формат: 9991233312"}
                    {...tel.bindings}
                />
                <Spacer y={0.5}/>
            </Modal.Body>
            <Modal.Footer>
                <Row justify={"space-around"}>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Отмена
                    </Button>
                    <Button auto onClick={createHandler}>
                        Создать
                    </Button>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}
