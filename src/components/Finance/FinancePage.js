import PageHeader from "../Utils/PageHeader/PageHeader";
import {Card, Container, Row, Spacer, Table, Text} from "@nextui-org/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../network/api";
import moment from "moment";
import {toast} from "react-hot-toast";
import TodayPlan from "./todayPlan";
import {HambergerMenu, TableDocument} from "iconsax-react";
import Stat from "./Stat";
import {useNavigate} from "react-router-dom";

export default function FinancePage() {
    const [notPaidEvents, setNotPaidEvents] = useState([]);

    useEffect(() => {
       axios.get(API.events, {params: {
                year: moment().year(),
                month: moment().month() + 1,
                day: moment().date(),
               type: "day"
           }})
           .then(resp => {
               if (resp.status === 200) {
                   setNotPaidEvents(resp.data ? resp.data : [])
               } else {
                   setNotPaidEvents([]);
               }
           })
           .catch(err => {
               toast.error("что-то пошло не так")
           })
    }, [])

    const navigate = useNavigate();

    return (
        <>
            <PageHeader title={"Финансы"} rightButton={{icon: <TableDocument  color="#555555"/>, handler: () => navigate("/finance/history")}}/>
            <Container>
                <Stat/>
                <Spacer/>
                <TodayPlan events={notPaidEvents}/>
            </Container>
        </>
    )
}
