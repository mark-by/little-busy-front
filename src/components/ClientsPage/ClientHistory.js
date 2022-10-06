import React from "react";
import {Badge, Card, Col, Row, Spacer, Text} from "@nextui-org/react";
import {useEffect} from "react";
import axios from "axios";
import {API} from "../../network/api";
import useValue from "../Utils/useValue";
import moment from "moment";
import {useSelector} from "react-redux";
import {priceCalculate} from "../Utils/Finance";
import {useNavigate} from "react-router-dom";
import HorizontalSelect from "../Common/HorizontalSelect/HorizontalSelect";

export default function ClientHistory({clientID}) {
    const navigate = useNavigate();
    const events = useValue([]);

    const settings = useSelector(state => state.settings);

    const options = [
        {title: "Были", value: "was"},
        {title: "Будут", value: "will"}
    ]

    const periodOptions = [
        {title: "месяц", value: 30},
        {title: "год", value: 365}
    ]

    const selectedOption = useValue(options[0]);
    const selectedPeriodOption = useValue(periodOptions[0]);

    useEffect(() => {
        let days = 365;
        let since = moment().subtract(days, "days");
        if (selectedOption.value.value === "will") {
            days = selectedPeriodOption.value.value;
            since = moment();
        }
        axios.get(API.events, {
            params: {
                type: "customer",
                customer_id: clientID,
                since: since.format(),
                days: days + 1,
            }
        })
            .then(result => {
                if (result.status !== 200) {
                    return;
                }
                if (result.data === null) {
                    events.setValue([]);
                    return;
                }
                if (selectedOption.value.value === "was") {
                    const filteredEvents = result.data.filter(item => moment(item.start_time) <= moment());
                    events.setValue(
                        filteredEvents.sort((l, r) => moment(r.start_time) - moment(l.start_time))
                    )
                } else {
                    events.setValue(result.data.filter(item => moment(item.start_time) > moment()));
                }
            })
            .catch(err => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOption.value.value, selectedPeriodOption.value.value])

    return (
        <>
            <Spacer/>
            <Row justify={"space-between"} align={"center"}>
                <Text h3>Сеансы</Text>
                <HorizontalSelect size={"sm"} options={options} selected={selectedOption.value} selectHandler={selectedOption.setValue}/>
            </Row>
            {selectedOption.value.value === "will" && <Spacer y={0.25}/>}
            {selectedOption.value.value === "will" &&
                <Row justify={"flex-end"} align={"center"}>
                    <Text>Ближайший</Text>
                    <Spacer x={0.25}/>
                    <HorizontalSelect
                        options={periodOptions}
                        selected={selectedPeriodOption.value}
                        selectHandler={selectedPeriodOption.setValue}
                        size={"xs"}
                    />
                </Row>
            }
            <Spacer/>
            {!!!events.value.length && <Row justify={"center"}><Text h4 color={"gray"}>Ничего нет</Text></Row>}
            {!!events.value.length && events.value.map(item => (
                <>
                    <Card isHoverable isPressable variant={"bordered"} key={item.id} onClick={() => navigate(`/schedule/${item.id}/${item.start_time}`)}>
                        <Card.Body>
                            <Row justify={"space-around"} align={"center"}>
                                <Badge variant={"flat"} color={"secondary"}>{moment(item.start_time).format("DD.MM.YY dd")}</Badge>
                                <Row css={{width: "min-content"}}>
                                    <Badge size={"sm"} variant={"flat"}>{moment(item.start_time).format("HH:mm")}</Badge>
                                    <Badge size={"sm"} variant={"flat"}>{moment(item.end_time).format("HH:mm")}</Badge>
                                    {/*<Badge variant={"flat"}>{moment.duration(moment(item.end_time).diff(moment(item.start_time))).asHours()} ч</Badge>*/}
                                </Row>
                                <Badge color={"success"}>{priceCalculate(item, settings.defaultPricePerHour)}₽</Badge>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Spacer y={0.5}/>
                </>
            ))}
        </>
    )
}