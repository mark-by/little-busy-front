import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {API} from "../../../network/api";
import {toast} from "react-hot-toast";
import PageHeader from "../../Utils/PageHeader/PageHeader";
import DeleteModal from "../../Utils/DeleteModal";
import {Button, Container, Input, Loading, Row, Spacer, useInput} from "@nextui-org/react";
import {IconButton} from "../../Common/IconButton";
import {Call, Trash} from "iconsax-react";
import ClientHistory from "../ClientHistory";

export default function ClientPage() {
    const params = useParams();
    const name = useInput("");
    const tel = useInput("");
    const specialPrice = useInput(null);
    const [initData, setInitData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API.customer(params.id))
            .then(resp => {
                name.setValue(resp.data.name);
                tel.setValue(resp.data.tel);
                specialPrice.setValue(resp.data.special_price_per_hour)
                setInitData(resp.data);
            })
            .catch(err => {
                toast.error("что-то пошло не так");
                navigate(-1);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const dataIsChanged = !!initData && (name.value !== initData.name || tel.value !== initData.tel || specialPrice.value !== initData.special_price_per_hour)

    const submitHandler = e => {
        e.preventDefault();
        if (!dataIsChanged) {
            return;
        }

        axios.put(API.customers, {id: +params.id, name: name.value, tel: tel.value, special_price_per_hour: specialPrice.value === null ? null : +specialPrice.value})
            .then(resp => {
                toast.success("Данные обновлены");
            })
            .catch(err => {
                toast.error("что-то пошло не так");
            })
    }

    const [deleteModalIsOpen, setDeleteModal] = useState(false);

    const onDeleteHandler = e => {
        setDeleteModal(true);
    }

    const onCloseDeleteModal = e => {
        setDeleteModal(false);
    }

    const deleteHandler = e => {
        axios.delete(API.customer(params.id))
            .then(resp => {
                toast.success("Клиент удален");
                navigate(-1);
            })
            .catch(err => {
                toast.error("что-то пошло не так");
                onCloseDeleteModal();
            })
    }

    const ref = useRef();

    return (
        <>
            <PageHeader withBack title={name.value ? name.value : <Loading/>}
                        rightButton={{icon:
                                <IconButton><Trash size="24" color="#f47373"/></IconButton>, handler: onDeleteHandler}}/>
            <Container>
                <form onSubmit={submitHandler}>
                    <Input fullWidth label={"Имя"} {...name.bindings}/>
                    <Row align={"flex-end"}>
                        <Input fullWidth label={"Телефон"} labelLeft={"+7"} {...tel.bindings}/>
                        {tel.value &&
                            <>
                                <Spacer x={0.5}/>
                                <a href={`tel:+7${tel.value}`} ref={ref} hidden>tel</a>
                                <Button auto color={"success"} icon={
                                    <Call
                                        size="20"
                                        color="#ffffff"
                                        variant="Bold"
                                    /> } onClick={() => {
                                    ref.current.click()}
                                }/>
                            </>

                        }
                    </Row>
                    <Input fullWidth label={"Специальная цена за час"} type={"number"} labelRight={"₽"} {...specialPrice.bindings}/>
                    <Spacer/>
                    <Row justify={"flex-end"}>
                        <Button auto type={"submit"} disabled={!dataIsChanged}>Обновить</Button>
                    </Row>
                </form>
                <DeleteModal onClose={onCloseDeleteModal} onDelete={deleteHandler} open={deleteModalIsOpen}/>
                <ClientHistory clientID={params.id}/>
            </Container>
        </>
    )
}
