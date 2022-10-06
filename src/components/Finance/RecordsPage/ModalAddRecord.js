import React from "react";
import {Button, Input, Modal, Row, Textarea, useInput} from "@nextui-org/react";
import moment from "moment";
import axios from "axios";
import {API} from "../../../network/api";
import {toast} from "react-hot-toast";

export default function ModalAddRecord({visible, closeHandler, createHandler}) {
    const value = useInput(undefined);
    const date = useInput(moment().format("YYYY-MM-DD"));
    const description = useInput(undefined);

    const submitHandler = (is_income) => {
        axios.post(API.records, {
            "value": +value.value,
            "datetime": `${date.value}T12:00:00Z`,
            "description": description.value,
            "is_income": is_income
        })
            .then(resp => {
                if (resp.status === 200) {
                    closeHandler();
                    createHandler(resp.data);
                }
            })
            .catch(err => {
                console.error(err)
                toast.error("Не удалось создать запись");
            })
    }

    const incomeOnClickHandler = () => {
        submitHandler(true)
    }

    const costOnClickHandler = () => {
        submitHandler(false)
    }

    return (
        <Modal
            closeButton
            blur
            aria-labelledby={"modal-title"}
            open={visible}
            onClose={closeHandler}
        >
            <Modal.Header>
            </Modal.Header>
            <Modal.Body>
                <Input placeholder={"Cумма"} type={"number"} aria-label={"value"} {...value.bindings}/>
                <Input type={"date"} aria-label={"date"} {...date.bindings}/>
                <Textarea placeholder={"Описание"} aria-label={"description"} {...description.bindings}/>
            </Modal.Body>
            <Modal.Footer>
                <Row justify={"space-around"}>
                    <Button auto color={"error"} onClick={costOnClickHandler}>Потрачено</Button>
                    <Button auto color={"success"} onClick={incomeOnClickHandler}>Получено</Button>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}
