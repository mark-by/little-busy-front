import React from "react";
import {useEffect} from "react";
import useValue from "../Utils/useValue";
import {Row, Spacer, Text} from "@nextui-org/react";
import moment from "moment";
import Select from "../Common/Select/Select";
import axios from "axios";
import {API} from "../../network/api";
import {toast} from "react-hot-toast";
import StatChart from "./StatChart";
import localization from 'moment/locale/ru';

function genEmptyDays(year, month) {
    const data = [];
    let current = 1;
    let end = moment(new Date(year, month, current)).daysInMonth();
    if (month === moment().month()) {
        end = moment().date();
    }
    for (; current <= end; current++) {
        data.push({
            incomes: 0,
            costs: 0,
            x: current
        })
    }

    return data;
}

function genEmptyMonths() {
    const months = moment.months();
    const data = [];
    for (let idx = 0; idx < months.length; idx++) {
        data.push({
            incomes: 0,
            costs: 0,
            x: months[idx]
        })
    }

    return data;
}

function convertCurrent(current, type) {
    if (type === "month") {
        return current
    }

    return moment.months()[current]
}

function prepareDataForMonth(data, props) {
    if (data === null || data.length === 0) {
        switch (props.type) {
            case "month":
                return genEmptyDays(props.year, props.month);
            case "year":
                return genEmptyMonths();
            default:
                return [];
        }
    }

    const {type} = props;

    const firstData = moment(data[0].date_time);

    const prepared = [];

    let getCurrent = date => (date.date());
    let current = 1;
    if (props.type === "year") {
        getCurrent = date => (date.month());
        current = 0;
    }

    let end = type === "year" ? 11 : firstData.daysInMonth();

    if (type === "year" && firstData.year() === moment().year() && firstData.month() === moment().month()) {
        end = moment().month();
    }
    if (type === "month" && firstData.year() === moment().year() && firstData.month() === moment().month()) {
        end = moment().date() - 1;
    }

    for (let idx = 0; idx < data.length; idx++) {
        const currFromData = getCurrent(moment(data[idx].date_time));
        if (current < currFromData) {
            for (;current < currFromData; current++) {
                prepared.push( {
                    incomes: 0,
                    costs: 0,
                    x: convertCurrent(current, type),
                })
            }
        }
        if (current === currFromData) {
            prepared.push({
                ...data[idx],
                x: convertCurrent(current, type)
            })
            current++;
        }
    }
    for (;current <= end; current++) {
        prepared.push( {
            incomes: 0,
            costs: 0,
            x: convertCurrent(current, type),
        })
    }

    return prepared;
}

export default function Stat() {
    moment.locale('ru', localization)
    const statTypes = [
        // {title: "день", type: "day"},
        {title: "Месяц", type: "month"},
        {title: "Год", type: "year"},
    ]
    const statType = useValue(statTypes[0]);

    const selectedYear = useValue({title: moment().year()});

    const availableYears = [];
    for (let idx = 0; idx < 3; idx++) {
        availableYears.push({title: moment().year() - idx});
    }

    const months = [
        {title:"Январь", id: 1},
        {title:"Февраль", id: 2},
        {title:"Март", id: 3},
        {title:"Апрель", id: 4},
        {title:"Май", id: 5},
        {title:"Июнь", id: 6},
        {title:"Июль", id: 7},
        {title:"Август", id: 8},
        {title:"Сентябрь", id: 9},
        {title:"Октябрь", id: 10},
        {title:"Ноябрь", id: 11},
        {title:"Декабрь", id: 12},
    ]

    const selectedMonth = useValue(months[moment().month()]);

    const data = useValue([]);

    useEffect(() => {
        axios.get(API.statistic, {params: {
                type: statType.value.type,
                month: selectedMonth.value.id,
                year: selectedYear.value.title
            }})
            .then(resp => {
                if (resp.status === 200) {
                    data.setValue(resp.data);
                }
            })
            .catch(err => {
                toast.error("Не удалось получить данные для графика");
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statType.value, selectedYear.value, selectedMonth.value])

    let total = {incomes: 0, costs: 0}

    if (data.value) {
        total = data.value.reduce((total, item) => {
            return {incomes: total.incomes + item.incomes, costs: total.costs + item.costs}
        }, total)
    }

    return (
        <div>
            <Text h3>Статистика</Text>
            <Row>
                <Select title={"Период"} options={statTypes} selected={statType.value} setSelected={statType.setValue}/>
                <Spacer x={0.5}/>
                {statType.value.type === "month" &&
                    <>
                        <Select title={"Месяц"} options={selectedYear.value.title === moment().year() ? months.slice(0, moment().month() + 1).reverse() : months.reverse()} selected={selectedMonth.value} setSelected={selectedMonth.setValue}/>
                        <Spacer x={0.5}/>
                    </>
                }
                <Select title={"Год"} options={availableYears} selected={selectedYear.value} setSelected={selectedYear.setValue} width={"100px"}/>
            </Row>
            <Spacer/>
            <Row>
                <div style={{width: "100%", height: "300px"}}>
                    <StatChart data={prepareDataForMonth(data.value, {type: statType.value.type, year: selectedYear.value.title, month: selectedMonth.value.id - 1})}/>
                </div>
            </Row>
            <Text color={"#F47373"}>Издержки: {total.costs} руб</Text>
            <Text color={"#37D67A"}>Выручка: {total.incomes} руб</Text>
            <Text b>Прибыль: {total.incomes - total.costs} руб</Text>
        </div>
    );
}
