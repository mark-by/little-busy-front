import React from "react";
import {Row, Spacer, Table, Text} from "@nextui-org/react";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {priceCalculate} from "../Utils/Finance";


export default function TodayPlan({events}) {
    const navigate = useNavigate();

    const columns = [
        {name: "Время", uid: "time"},
        {name: "Клиент", uid: "client"},
        {name: "Стоимость", uid: "price"},
    ]

    const showEvents = events.filter(event => event.customer && event.price !== 0 && event.customer?.special_price_per_hour !== 0)


    const settings = useSelector(state => state.settings);

    let total = 0;

    if (events.length !== 0) {
        total = events.map(event => priceCalculate(event, settings.defaultPricePerHour)).reduce((total, num) => total + num);
    }

    const renderCell = (event, columnKey) => {
        switch (columnKey) {
            case "time":
                return <Text>{moment(event.start_time).format("HH:mm")}</Text>
            case "client":
                return <Text>{event.customer.name}</Text>
            case "price":
                return priceCalculate(event, settings.defaultPricePerHour);
            default:
                return columnKey
        }
    }
    const selectHandler = (selection) => {
        navigate(`/schedule/${selection.currentKey}/${events.filter(event => event.id = selection.currentKey)[0].start_time}`)
    }

    return (
        <>
            <Text h3>По плану на сегодня</Text>
            {events.length !== 0 &&
                <div>
                    <Table
                        shadow={false}
                        aria-label="planning events"
                        css={{
                            height: "auto",
                            minWidth: "100%",
                        }}
                        selectionMode="single"
                        onSelectionChange={selectHandler}
                    >
                        <Table.Header columns={columns}>
                            {(column) => (
                                <Table.Column
                                    key={column.uid}
                                >
                                    {column.name}
                                </Table.Column>
                            )}
                        </Table.Header>
                        <Table.Body items={showEvents}>
                            {(item) => (
                                <Table.Row>
                                    {(columnKey) => (
                                        <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                                    )}
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <Text b>Итого: {total}₽</Text>
                </div>
            }
            {events.length === 0 &&
                <div>
                    <Spacer/>
                    <Row align={"center"} justify={"center"}><Text h4 color={"#555555"}>Сегодня деняг не планируется :(</Text></Row>
                </div>
            }
        </>
    )
}
