import React from "react";
import {Container} from "@nextui-org/react";
import PageHeader from "../Utils/PageHeader/PageHeader";
import {useNavigate, useParams} from "react-router-dom";
import {TickCircle} from "iconsax-react";
import {API} from "../../network/api";
import axios from "axios";
import {toast} from "react-hot-toast";
import moment from "moment";
import EventForm, {DataFromEventInputs, EventFormInputs} from "./EventForm";

const dateFormat = "YYYY-MM-DDTHH:00:00"

export default function CreateEvent() {
    const params = useParams();

    const inputs = EventFormInputs(
        params.year ? moment({y: params.year, M: params.month - 1, d: params.day, h: params.hour}).format(dateFormat) : moment().format(dateFormat),
        1,
        false,
        "weekly",
        null,
        null,
        ""
        )

    const navigate = useNavigate();

    const createEventHandler = () => {
        const data = DataFromEventInputs(inputs);
        axios.post(API.events, data)
            .then(resp => {
                toast.success("Событие создано успешно");
                navigate(-1);
            })
            .catch(resp => {
                toast.error("Произошла ошибка при создании события");
            })
    }


    return (
        <>
            <PageHeader withBack title={"Создание события"}
                        rightButton={{
                            icon: <TickCircle size="32" color="#37d67a"/>,
                            handler: createEventHandler
                        }}/>
            <Container>
                <EventForm inputs={inputs}/>
            </Container>
        </>
    )
}
