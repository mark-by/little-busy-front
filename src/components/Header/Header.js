import React from "react";
import {useNavigate} from "react-router-dom";
import "./Header.css";
import {useEffect, useState} from "react";
import {Col, Row, Text} from "@nextui-org/react";
import {Calendar, Coin1, Profile2User, Setting2} from "iconsax-react";
import {IconButton} from "../Common/IconButton";

export default function Header() {
    const [selected, setSelected] = useState(document.location.pathname);
    const buttons = [
        {title: "Расписание", link: "schedule", icon: <Calendar color="#555555"/>, iconSelected: <Calendar color="rgb(0,112,243)"/>},
        {title: "Клиенты", link: "clients", icon: <Profile2User color="#555555"/>, iconSelected: <Profile2User color="rgb(0,112,243)"/>},
        {title: "Финансы", link: "finance", icon: <Coin1 color="#555555"/>, iconSelected: <Coin1 color="rgb(0,112,243)"/>},
        {title: "Настройки", link: "settings", icon: <Setting2 color="#555555"/>, iconSelected: <Setting2 color="rgb(0,112,243)"/>},
    ];

    useEffect(() => {
        if (selected === "/") {
            setSelected("schedule")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const navigate = useNavigate()

    return (
        <Row justify={"space-evenly"} align={"center"} css={{
            height: "50px",
            background: "white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            position: "fixed",
            zIndex: "999",
            bottom: 0,
            left: 0,
            right: 0,
        }}>
            {buttons.map(button => (
                <Col onClick={() => {navigate(button.link); setSelected(button.link)}}>
                    <Row justify={"center"}>
                        <IconButton>
                            {selected.includes(button.link) ? button.iconSelected : button.icon}
                        </IconButton>
                    </Row>
                    <Row justify={"center"}>
                        <Text size={10} color={selected.includes(button.link) ? "primary" : "black"}>
                            {button.title}
                        </Text>
                    </Row>
                </Col>
                    // <Link to={button.link}>
                    //     <Text h5 css={{cursor: "pointer"}}
                    //           color={selected.includes(button.link) ? "primary" : "black"}
                    //           onClick={() => setSelected(button.link)}
                    //     >{button.title}</Text>
                    // </Link>
            ))}
        </Row>
    )
}
