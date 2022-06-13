import React from 'react';
import {Input, Row, Spacer, Switch, Text, Textarea, useInput} from "@nextui-org/react";
import AutoSelect from "../Common/AutoSelect/AutoSelect";
import {API} from "../../network/api";
import {IconButton} from "../Common/IconButton";
import {AddCircle, User} from "iconsax-react";
import HorizontalList from "../Common/HorizontalList/HorizontalList";
import moment from "moment";
import ModalCreateClient from "../ClientsPage/ModalCreateClient";
import useValue from "../Utils/useValue";
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";

export function EventFormInputs(startTime, duration, isRecurring, period, client, price, comment) {
    return {
        startTime: useInput(startTime ? startTime : moment().format("YYYY-MM-DDTHH:00:00")),
        duration: useValue(duration ? duration : 1),
        isRecurring: useValue(isRecurring ? isRecurring : false),
        period: useValue(period ? period : "weekly"),
        client: useValue(client ? client : null),
        price: useInput(price ? price : null),
        comment: useInput(comment ? comment : ""),
        withNext: false,
    }
}

function isNull(num) {
    return num === undefined || num === null || num === "" || isNaN(num);
}

export function DataFromEventInputs(inputs) {
    return {
        customer_id: inputs.client.value ? inputs.client.value.id : null,
        start_time: moment(inputs.startTime.value).format(),
        end_time: moment(inputs.startTime.value).add(inputs.duration.value, "h").format(),
        price: isNull(inputs.price?.value) ? null : +inputs.price.value,
        is_recurring: inputs.isRecurring.value,
        period: inputs.period.value,
        description: inputs.comment.value ? inputs.comment.value : "",
    }
}

export default function EventForm({inputs, hourCost}) {
    const openCreateClient = useValue(false);
    const settings = useSelector(state => state.settings);

    const createHandler = (client) => {
        inputs.client.setValue(client);
    }

    const durations = [
        {title: "30 мин", value: 0.5},
        {title: "1 ч", value: 1},
        {title: "1,5 ч", value: 1.5},
        {title: "2 ч", value: 2},
        {title: "3 ч", value: 3},
    ]

    const periods = [
        {title: "ежедневно", value: "daily"},
        {title: "еженедельно", value: "weekly"},
        {title: "ежемесячно", value: "monthly"},
    ]

    const navigate = useNavigate();

    const defaultPricePerHour = !isNull(inputs.price?.value) ? +inputs.price.value :
        !isNull(inputs.client.value?.special_price_per_hour) ? inputs.client.value.special_price_per_hour :
            settings.defaultPricePerHour;

    const totalDefaultPrice = defaultPricePerHour * inputs.duration.value;

    return (
        <>
            <Row align={"center"}>
                <AutoSelect title={"Клиент"} api={API.customers} width={"100%"} selected={inputs.client.value} setSelected={inputs.client.setValue}/>
                <Spacer/>
                {inputs.client.value && 
                    <>
                        <IconButton onClick={() => navigate("/clients/" + inputs.client.value.id)}>
                            <User size="32" color="#37d67a"/>
                        </IconButton>
                        <Spacer y={0.5}/>
                    </>
                                        }
                <IconButton onClick={() => openCreateClient.setValue(true)}><AddCircle size={32} color="#37d67a"/></IconButton>
            </Row>
            <Input type={"datetime-local"} fullWidth label={"Начало"} {...inputs.startTime.bindings}/>

            <Text size={14} css={{padding: "4px"}}>Продолжительность</Text>
            <HorizontalList list={durations}
                            title={item => (item.title)}
                            current={item => item.value === inputs.duration.value}
                            click={item => {inputs.duration.setValue(item.value); inputs.price.setValue(String(item.value * hourCost))}}
            />
            <Text size={10} color={"gray"} css={{padding: "4px"}}>Конец в {moment(inputs.startTime.value).add(inputs.duration.value, "h").format("HH:mm")}</Text>

            {
                inputs.client.value &&
                <div>
                    <Input type={"number"} fullWidth label={"Цена"} placeholder={totalDefaultPrice}
                           labelRight={"₽"} helperText={!isNull(inputs.price.value) ? "" : "цена рассчитана автоматически"} {...inputs.price.bindings}/>
                    {isNull(inputs.price.value) && <Spacer x={0.5}/>}
                </div>

            }

            <Row justify={"space-between"} align={"center"}>
                <Text size={14} css={{padding: "4px"}}>Повторение</Text>
                <Switch checked={inputs.isRecurring.value} size={"xs"} onChange={e => inputs.isRecurring.setValue(e.target.checked)}/>
            </Row>

            {inputs.isRecurring.value && <>
                <HorizontalList list={periods}
                                title={item => (item.title)}
                                current={item => item.value === inputs.period.value}
                                click={item => inputs.period.setValue(item.value)}
                />
            </>}

            <Spacer/>
            <Textarea fullWidth placeholder={"Комментарий"} {...inputs.comment.bindings}/>

            <ModalCreateClient open={openCreateClient.value} onCreate={createHandler} onClose={() => openCreateClient.setValue(false)}/>
        </>
    )
}
