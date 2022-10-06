import React from "react";
import {Button, Col, Container, Input, Row, Spacer, useInput} from "@nextui-org/react";
import PageHeader from "../Utils/PageHeader/PageHeader";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {API} from "../../network/api";
import {toast} from "react-hot-toast";
import {actionsSettings} from "../../redux/actions";

export default function SettingsPage() {
    const settings = useSelector(state => state.settings);

    const startWork = useInput(settings.startWork);
    const endWork = useInput(settings.endWork);
    const defaultPricePerHour = useInput(settings.defaultPricePerHour);
    const dispatch = useDispatch();

    const settingsHandler = () => {
       axios.put(API.settings, {start_work_hour: +startWork.value, end_work_hour: +endWork.value, default_price_per_hour: +defaultPricePerHour.value})
           .then(resp => {
               if (resp.status === 200) {
                   toast.success("Настройки сохранены");
                   dispatch(actionsSettings.set({startWork: +startWork.value, endWork: +endWork.value, defaultPricePerHour: +defaultPricePerHour.value}));
               }
           })
           .catch(err => {
               toast.error("Не удалось ;(");
           })
    }

    return (
        <>
            <PageHeader title={"Настройки"}/>
            <Container>
                <Row>
                    <Col css={{mr: "10px"}}>
                        <Row>
                            <Input label={"Начало рабочего дня"} type={"number"} {...startWork.bindings} labelRight={"ч"}/>
                        </Row>
                        <Row>
                            <Input label={"Конец рабочего дня"} type={"number"} {...endWork.bindings} labelRight={"ч"}/>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Input label={"Стандартная цена"} type={"number"} {...defaultPricePerHour.bindings} labelRight={"₽"}/>
                        </Row>
                    </Col>
                </Row>
                <Spacer/>
                <Button auto type={"submit"} onClick={settingsHandler}>Сохранить</Button>
            </Container>
        </>
    )
}
