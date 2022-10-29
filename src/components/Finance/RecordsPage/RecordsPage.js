import React, {useCallback} from "react";
import PageHeader from "../../Utils/PageHeader/PageHeader";
import {AddCircle, Edit, Trash} from "iconsax-react";
import {Card, Col, Container, Loading, Row, Spacer, Text} from "@nextui-org/react";
import useValue from "../../Utils/useValue";
import axios from "axios";
import {API} from "../../../network/api";
import {toast} from "react-hot-toast";
import useInfiniteScroll from "react-infinite-scroll-hook";
import moment from "moment";
import {IconButton} from "../../Common/IconButton";
import ModalAddRecord from "./ModalAddRecord";
import ModalEditRecord from "./ModalEditRecord";

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

    const onCreate = (record) => {
        records.setValue([]);
        since.setValue(0);
        hasMore.setValue(true);
    }

    const onDelete = (record) => {
        axios.delete(API.record(record.id))
            .then(result => {
                records.setValue(oldRecords => oldRecords.filter(item => item.id !== record.id))
                toast.success("Успешно удалили");
            })
            .catch(err => {
                toast.error("Не удалось удалить запись");
            })
    }

    const editModalVisible = useValue(false);
    const recordToEdit = useValue(null);

    const onEdit = (record) => {
        recordToEdit.setValue(record);
        editModalVisible.setValue(true);
    }

    const updateRecord = useCallback((recordID, value) => {
       const allRecords = records.value;
       const toUpdateIdx = allRecords.findIndex(el => el.id === recordID);
       if (toUpdateIdx === -1) {
           return
       }
       allRecords[toUpdateIdx].value = value;
    }, [records]);

    return (
        <>
            <PageHeader withBack title={"Расходы и доходы"} rightButton={{icon: <AddCircle  color="#37d67a"/>, handler: () => visibleModal.setValue(true)}}/>
            <Container>
                {(!!!records.value.length && !loading.value) && <Row justify={"center"}>
                    <Text h4 color={"gray"}>Записей еще нет</Text>
                </Row>}
                {records.value.map(record => (
                    <div key={record.id}>
                        <Card variant={"flat"} css={{background: record.is_income ? "#e6ffe5" : "#ffdcdc", mb: "10px"}}>
                            <Card.Body>
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
                                    <Col css={{w: "170px"}}>
                                        <Row justify={"space-between"} align={"center"}>
                                            <IconButton css={{cursor: "pointer"}} onClick={() => onEdit(record)}>
                                                <Edit size="28" color="#444"/>
                                            </IconButton>
                                            <IconButton css={{cursor: "pointer"}} onClick={() => onDelete(record)}>
                                                <Trash size="28" color="#f47373"/>
                                            </IconButton>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
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
                {recordToEdit.value && <ModalEditRecord
                                            closeHandler={() => editModalVisible.setValue(false)}
                                            visible={editModalVisible.value}
                                            record={recordToEdit.value}
                                            updateRecord={updateRecord}/>
                }
            </Container>
        </>
    );
}
