import PageHeader from "../../Utils/PageHeader/PageHeader";
import {AddCircle, TableDocument, Trash} from "iconsax-react";
import {Card, Col, Container, Loading, Row, Spacer, Table, Text, useAsyncList} from "@nextui-org/react";
import Stat from "../Stat";
import TodayPlan from "../todayPlan";
import useValue from "../../Utils/useValue";
import {useEffect} from "react";
import axios from "axios";
import {API} from "../../../network/api";
import {toast} from "react-hot-toast";
import useInfiniteScroll from "react-infinite-scroll-hook";
import moment from "moment";
import {IconButton} from "../../Common/IconButton";
import ModalAddRecord from "./ModalAddRecord";

export default function RecordsPage() {
    const records = useValue([]);
    const loading = useValue(false);
    const since = useValue(0);
    const hasMore = useValue(true);

    const visibleModal = useValue(false);

    const loadData = () => {
        loading.setValue(true);
        axios.get(API.records, {
            params: {
                limit: 100,
                since: since.value
            }
        })
            .then(resp => {
                if (resp.status === 200) {
                    const newRecords = [...records.value, ...resp.data];
                    records.setValue(newRecords);
                    since.setValue(newRecords.length);
                    loading.setValue(false)
                    return
                }
                if (resp.status === 204) {
                    loading.setValue(false)
                    hasMore.setValue(false);
                }
            })
            .catch(err => {
                toast.error("Не удалось получить записи");
                loading.setValue(false);
                hasMore.setValue(false);
            })
    }

    const [scrollRef] = useInfiniteScroll({
        loading: loading.value,
        hasNextPage: hasMore.value,
        onLoadMore: loadData,

    })

    const columns = [
        {name: "Дата", uid: "datetime"},
        {name: "Описание", uid: "description"},
        {name: "Стоимость", uid: "value"},
        {name: "Удалить", uid: "action"},
    ]

    const onCreate = (record) => {
        records.setValue([]);
        since.setValue(0);
        hasMore.setValue(true);
    }

    return (
        <>
            <PageHeader withBack title={"Расходы и доходы"} rightButton={{icon: <AddCircle  color="#37d67a"/>, handler: () => visibleModal.setValue(true)}}/>
            <Container>
                {records.value.map(record => (
                    <div key={record.id}>
                        <Card css={{background: record.is_income ? "#e6ffe5" : "#ffdcdc"}} shadow={false}>
                            <Row justify={"flex-start"} align={"center"}>
                                <Col css={{w: "100px"}}>
                                    <Row justify={"center"}>
                                        <Text size={12}>{moment(record.datetime).format("D")}</Text>
                                    </Row>
                                    <Row justify={"center"}>
                                        <Text size={10}>{moment(record.datetime).format("DD MMM").slice(3)}</Text>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row justify={"center"}>
                                        <Text >{record.description}</Text>
                                    </Row>
                                </Col>
                                <Col>
                                    <Text b >{record.value} р</Text>
                                </Col>
                                <Col css={{w: "30px"}}>
                                    <IconButton css={{cursor: "pointer"}}>
                                        <Trash size="28" color="#f47373"/>
                                    </IconButton>
                                </Col>
                            </Row>
                        </Card>
                        <Spacer y={0.1}/>
                    </div>
                ))}
                {(loading.value || hasMore.value) &&
                    <Row justify={"center"}>
                        <Spacer/>
                        <div ref={scrollRef}>
                            <Loading/>
                        </div>
                    </Row>}
                <ModalAddRecord closeHandler={() => visibleModal.setValue(false)} visible={visibleModal.value} createHandler={onCreate}/>
            </Container>
        </>
    );
}
