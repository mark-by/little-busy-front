import React, {useEffect, useState} from "react";
import './Schedule.css';
import HorizontalList from "../Common/HorizontalList/HorizontalList";
import {useSelector} from "react-redux";
import ScheduleDay from "./ScheduleDay";
import {Container, Spacer} from "@nextui-org/react";
import axios from "axios";
import {API} from "../../network/api";
import {toast} from "react-hot-toast";
import PageHeader from "../Utils/PageHeader/PageHeader";
import {AddCircle} from "iconsax-react";
import {useNavigate} from "react-router-dom";
import moment from "moment";

function daysInMonth(year, month) {
    return 33 - new Date(year, month, 33).getDate();
}

function weekDayToStr(weekday) {
    switch (weekday) {
        case 0:
            return "Пн";
        case 1:
            return "Вт";
        case 2:
            return "Ср";
        case 3:
            return "Чт";
        case 4:
            return "Пт";
        case 5:
            return "Сб";
        case 6:
            return "Вс";
        default:
            return "Undef";
    }
}

function getValidDays(numDays, currYearIdx, currMonthIdx, currDay) {
    const days = [];
    for (let i = 1; i <= numDays; i++) {
        if (currMonthIdx === 0 && currYearIdx === 0) {
            if (i >= currDay) {
                days.push(i);
            }
        } else {
            days.push(i);
        }
    }
    return days;
}

const months = ['Янфарь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

function createDaysMap(events) {
    const daysMap = {}
    events.forEach(event => {
        const day = moment(event.start_time).date();
        if (daysMap[day]) {
            daysMap[day].push(event);
            return;
        }
        daysMap[day] = [event]
    })

    return daysMap
}

export default function Schedule() {
    const settings = useSelector(state => state.settings);

    const now = new Date();

    const [currYearIdx, setCurrYear] = React.useState(0);
    const [currMonthIdx, setCurrMonth] = React.useState(0);

    const currYear = currYearIdx + now.getFullYear();
    const currMonth = currMonthIdx + (!currYearIdx ? now.getMonth() : 0) + 1;
    const currDay = (!(currYearIdx || currMonthIdx) ? now.getDate() : 1);
    const days = getValidDays(daysInMonth(currYear, currMonth - 1), currYearIdx, currMonthIdx, now.getDate())

    const times = [];
    const startWorkTime = settings.startWork;
    const stopWorkTime = settings.endWork;
    for (let hour = startWorkTime; hour <= stopWorkTime; hour++) {
        times.push(hour);
    }

    const [events, setEvents] = useState([]);

    const scheduleRef = React.useRef(null);
    React.useEffect(() => {
            // dispatch(fetchEvents(currYear, currMonth, scheduleRef));
        axios.get(API.events, {params: {
                year: currYear,
                month: currMonth,
                type: "month"
            }})
            .then(resp => {
                if (resp.data) {
                    setEvents(resp.data);
                }
            })
            .catch(err => {
                toast.error("что-то пошло не так при загрузке событий");
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currMonthIdx, currYearIdx]);


    const startWeekday = new Date(currYear, currMonth - 1, currDay).getUTCDay();

    const navigate = useNavigate();

    const [daysMap, setDaysMap] = useState({});

    useEffect(() => {
        const res = createDaysMap(events)
        setDaysMap(res);

    }, [events])

    return (
        <>
            <PageHeader title={"Расписание"} rightButton={{icon: <AddCircle size={32} color="#37d67a"/>, handler: () => navigate("/schedule/new")}}/>
        <Container>
            <HorizontalList list={[now.getFullYear(), now.getFullYear() + 1]} title={item => (item)}
                            click={(item, idx) => {
                                setCurrYear(idx)
                            }} current={(item, idx) => idx === currYearIdx}
            />
            <Spacer y={0.5}/>
            <HorizontalList list={months.filter((month, idx) => {
                if (currYearIdx === 0) {
                    return idx >= now.getMonth();
                } else {
                    return true;
                }
            })} title={item => (item)} click={(item, idx) => {setCurrMonth(idx)}}
                            current={(item, idx) => idx === currMonthIdx}/>
            <Spacer y={0.5}/>

            {days.map((day, idx) => {
                const currWeekday = (startWeekday + idx) % 7;

                return (
                    <>
                        <ScheduleDay times={times} events={daysMap[day] ? daysMap[day] : []} weekday={weekDayToStr(currWeekday)} ref={scheduleRef} day={day} month={currMonth} year={currYear}/>
                        {currWeekday === 6 && <div className="schedule__days-division"/>}
                    </>
                )
            })}
        </Container>
        </>
    )
}
