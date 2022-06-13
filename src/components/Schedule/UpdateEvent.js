import {useNavigate, useParams} from "react-router-dom";
import moment from "moment";
import EventForm, {DataFromEventInputs, EventFormInputs} from "./EventForm";
import axios from "axios";
import {API} from "../../network/api";
import {toast} from "react-hot-toast";
import PageHeader from "../Utils/PageHeader/PageHeader";
import {TickCircle} from "iconsax-react";
import {Button, Container, Spacer, Modal} from "@nextui-org/react";
import useValue from "../Utils/useValue";
import {useEffect} from "react";
import ModalWithNext from "./ModalWithNext";

export default function UpdateEvent() {
    const params = useParams();

    const inputs = EventFormInputs()
    const initData = useValue();
    const withNextUpdateModalOpen = useValue(false);
    const withNextDeleteModalOpen = useValue(false);

    useEffect(() => {
        axios.get(API.event(params.id))
            .then(resp => {
                const {data} = resp;

                initData.setValue({...data, start_time: params.date ? params.date : data.start_time});
                console.log(params.date)

                inputs.startTime.setValue(moment(params.date ? params.date : data.start_time).format("YYYY-MM-DDTHH:mm:ss"));
                inputs.duration.setValue(moment.duration(moment(data.end_time).diff(moment(data.start_time))).asHours());
                inputs.isRecurring.setValue(data.is_recurring)
                inputs.period.setValue(data.period)
                inputs.client.setValue(data.customer ? {name: data.customer.name, id: data.customer.id, special_price_per_hour: data.customer.special_price_per_hour} : null)
                inputs.price.setValue(data.price)
                inputs.comment.setValue(data.description)
            })
            .catch(err => {
                console.error(err)
                toast.error("Что-то пошло не так");
            })
    }, []);

    const navigate = useNavigate();

    const updateEvent = (with_next) => {
        const data = DataFromEventInputs(inputs);
        axios.put(API.events, {...data, id: +params.id}, {params: {with_next: with_next, date: initData.value.start_time}})
            .then(resp => {
                toast.success("Событие обновлено успешно");
                navigate(-1);
            })
            .catch(resp => {
                    toast.error("Произошла ошибка при обновлении события");
            })
    }

    const deleteEvent = (with_next) => {
        axios.delete(API.event(params.id), {params: {with_next: with_next, date: initData.value.start_time}})
        .then(res => {
            toast.success("Успешно!");
            navigate(-1);
        })
        .catch(err => {
            toast.error("Что-то пошло не так");
        })
    }

    const deleteEventHandler = () => {
        console.log(initData.value)
        if (initData.value.is_recurring) {
            withNextDeleteModalOpen.setValue(true);
            return;
        }

        console.log("NOT")

        deleteEvent(false);
    }

    const updateEventHandler = () => {
        if (initData.value.is_recurring) {
            withNextUpdateModalOpen.setValue(true);
            return;
        }

        updateEvent(false);
    }


    return (
        <>
            <PageHeader withBack title={"Обновление события"}
                        rightButton={{
                            icon: <TickCircle size="32" color="#37d67a"/>,
                            handler: updateEventHandler
                        }}/>
            <Container>
                <EventForm inputs={inputs}/>
                <Spacer/>
                <Button color={"error"} flat onClick={deleteEventHandler}>Удалить</Button>
                <ModalWithNext open={withNextUpdateModalOpen.value} closeHandler={() => withNextUpdateModalOpen.setValue(false)} buttonHandler={updateEvent}/>
                <ModalWithNext open={withNextDeleteModalOpen.value} closeHandler={() => withNextDeleteModalOpen.setValue(false)} buttonHandler={deleteEvent}/>
            </Container>
        </>
    )
}
