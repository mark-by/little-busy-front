import React, {useEffect} from "react";
import {Button, Input, Modal, Row, Spacer, Text, useInput} from "@nextui-org/react";
import axios from "axios";
import {API} from "../../../network/api";
import {toast} from "react-hot-toast";
import useValue from "../../Utils/useValue";

export default function ModalEditRecord({visible, closeHandler, record, updateRecord}) {
    const recordValue = useInput(record.value);
    const errorText = useValue(null);

    useEffect(() => {
        recordValue.setValue(record.value);
    }, [record.value]);

    const onClose = () => {
        recordValue.reset();
        errorText.setValue(null);
        closeHandler();
    }

    const onSaveHandler = () => {
        if (recordValue.value === "") {
            errorText.setValue("Поле не может быть пустым");
            return;
        }
        axios.patch(API.record(record.id), {
            value: +recordValue.value
        })
            .then(response => {
                if (response.status === 200) {
                    updateRecord(record.id, recordValue.value);
                    onClose();
                    toast.success(`Запись ${record.description} успешно обновлена`);
                }
            })
            .catch(err => {
                toast.error("Запись не удалось обновить");
            })
    }

    return (
        <Modal
            closeButton
            blur
            aria-labelledby={"modal-title"}
            open={visible}
            onClose={onClose}
        >
            <Modal.Header>
                <Text>{record.description}</Text>
            </Modal.Header>
            <Modal.Body>
                <Input
                    placeholder={"Cумма"}
                    type={"number"}
                    aria-label={"value"}
                    helperColor={"error"}
                    helperText={errorText.value}
                    {...recordValue.bindings} />
                <Spacer y={0.5}/>
            </Modal.Body>
            <Modal.Footer>
                <Row justify={"space-around"}>
                    <Button auto color={"success"} onClick={onSaveHandler}>Сохранить</Button>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}
