import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import moment from "moment";
import useValue from "../Utils/useValue";
import {Row, Text} from "@nextui-org/react";

function ScheduleDay({weekday, year, month, day, times, events}, ref) {
    const [secondCost, setSecondCost] = useState(0);

    const startRef = useRef();
    const endRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (startRef.current && endRef.current) {
           setSecondCost((endRef.current.offsetLeft + endRef.current.offsetWidth - startRef.current.offsetLeft) / (60 * 60 * (times.length - 1)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startRef.current?.offsetLeft, endRef.current?.offsetLeft])

    const startDayTime = moment({y: year, M: month - 1, d: day, h: times[0]})
    const now = moment();
    const timeDiff = moment.duration(now.diff(startDayTime)).asHours();

    const currTimePosition = useValue(timeDiff * 60 * 60 * secondCost);

    useEffect(() => {
        if (timeDiff > 24 || timeDiff < 0 || secondCost === 0) {
            return;
        }
        function work() {
            const now = moment();
            const timeDiff = moment.duration(now.diff(startDayTime)).asSeconds();
            currTimePosition.setValue(timeDiff * secondCost);
        }
        work();
        const interval = setInterval(() => {
            work()
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondCost]);

    const isFreeDay = startDayTime.weekday() === 0 || startDayTime.weekday() === 6;
    return (
        <>
            <div className="schedule__day">
                <div className="schedule__weekday">
                    <Row><Text size={12} weight="bold" color={isFreeDay ? "error" : ""}>{day}</Text></Row>
                    <Row><Text size={10} color={isFreeDay ? "error" : ""}>{weekday}</Text></Row>
                </div>
                <div className="schedule__row" ref={ref}>
                    {times.map((tm, idx) => (
                        <div
                            key={idx}
                            ref={idx === 0 ? startRef : idx === times.length - 1 ? endRef : null}
                            onClick={e => navigate(`/schedule/new/${year}/${month}/${day}/${tm}`)}
                            className="schedule__line">
                            <div className={"time_label"}>{tm}</div>
                        </div>))}

                    { (timeDiff < 24 && timeDiff >= 0) &&
                        <div
                            className={"schedule__line"}
                            style={{
                                zIndex: "2",
                                position: "absolute",
                                border: "solid red 1px",
                                left: `${currTimePosition.value}px`
                            }}
                        />}

                    {events.map((event, idx) => {
                        const startTime = moment(event.start_time);
                        const endTime = moment(event.end_time);
                        const startDiff = moment.duration(startTime.diff(startDayTime)).asSeconds() * secondCost;
                        const duration = moment.duration(endTime.diff(startTime)).asSeconds() * secondCost ;
                        let style = {left: `${startDiff}px`, width: `${duration}px`};
                        return (
                            <div className="schedule__event" key={idx} onClick={() => navigate(`/schedule/${event.id}/${event.start_time}`)} style={style}>
                                {/*<div className="schedule__event_start-time">{moment(event.start_time).format("HH:mm")}</div>*/}
                                {event.customer && <p className="schedule__event_client-name">{event.customer.name}</p>}
                                {/*<div className="schedule__event_end-time">{moment(event.end_time).format("HH:mm")}</div>*/}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default React.forwardRef(({times, day, weekday, events, month, year}, ref) => ScheduleDay({
    times,
    day,
    weekday,
    events,
    month,
    year
}, ref))
