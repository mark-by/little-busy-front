import React from "react";
import PageHeader from "../Utils/PageHeader/PageHeader";
import {Card, Container, Text} from "@nextui-org/react";

export default function Fish({title}) {
    return (
        <>
            <PageHeader title={title}/>
            <Container>
                <Card color={"warning"}>
                    <Text>В разработке</Text>
                </Card>
            </Container>
        </>
    );
}
