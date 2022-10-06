import React from "react";
import {useNavigate} from "react-router-dom";
import "./PageHeader.css";
import {Row, Spacer, Text} from "@nextui-org/react";
import {IconButton} from "../../Common/IconButton";
import {ArrowLeft2} from "iconsax-react";

export default function PageHeader({title, rightButton, withBack}) {
    const navigate = useNavigate();

    return (
        <>
            <Spacer y={0.5}/>
            <Row justify={"center"} align={"center"} css={{position: "relative", height: "35px"}}>
                {withBack &&
                    <IconButton css={{position: "absolute", left: "10px"}} onClick={() => navigate(-1)}>
                        <ArrowLeft2 size={24} color="#555555"/>
                    </IconButton>
                }

                <Text h4>{title}</Text>
                {rightButton && <IconButton css={{position: "absolute", right: "10px"}}
                                            light auto onClick={rightButton.handler}>{rightButton.icon}</IconButton>}
            </Row>
            <Spacer/>
        </>
    )
}
