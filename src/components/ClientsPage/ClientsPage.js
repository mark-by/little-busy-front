import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../network/api";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import {
    Card,
    Container,
    Input,
    Loading,
    Row,
    Spacer,
    Text,
    useInput
} from "@nextui-org/react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import {IconButton} from "../Common/IconButton";
import {AddCircle, Trash} from "iconsax-react";
import ModalCreateClient from "./ModalCreateClient";
import PageHeader from "../Utils/PageHeader/PageHeader";

export default function ClientsPage() {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [since, setSince] = useState("");
    const [hasMore, setHasMore] = useState(true);

    const [createClientIsOpen, setOpenCreateClient] = useState(false);


    const search = useInput("");



    const loadData = (withoutSince) => {
        setLoading(true);
        axios.get(API.customers, {
            params: {
                searchText: search.value,
                limit: 20,
                since: withoutSince ? "" : since,
            }
        })
            .then(resp => {
                if (resp.status === 204) {
                    setHasMore(false);
                    setLoading(false);
                    return;
                }
                setClients(data => [...data, ...resp.data])
                setSince(resp.data[resp.data.length - 1].name)
                setLoading(false);
            })
            .catch(err => {
                toast.error("Что-то пошло не так");
                setLoading(false);
            })
    }

    const [scrollRef] = useInfiniteScroll({
        loading: loading,
        hasNextPage: hasMore,
        onLoadMore: loadData,

    })

    useEffect(() => {
        setHasMore(true);
        setClients([]);
        setSince("");
    }, [search.value])

    const closeHandler = () => {
        setOpenCreateClient(false)
    };

    const deleteHandler = (e, id) => {
        e.stopPropagation();
        axios.delete(API.customer(id))
            .then(resp => {
                toast.success("Клиент удален");
                setClients(clients.filter(client => client.id !== id))
            })
            .catch(err => {
                toast.error("что-то пошло не так");
            })
    }

    const createHandler = (item) => {
        setClients([]);
        loadData(true);
    }

    return (
        <>
            <PageHeader title={"Клиенты"} rightButton={{icon: <AddCircle size="32" color="#37d67a"/>, handler: () => setOpenCreateClient(true)}}/>
            <Container>
                <Input fullWidth clearable underlined aria-label={"search field"} size={"md"} placeholder={"имя или телефон"} {...search.bindings}/>
                <Spacer/>
                {clients.map(client => (
                    <div key={client.id}>
                        <Card variant={"bordered"} isPressable isHoverable onClick={() => navigate(`/clients/${client.id}`)}>
                            <Card.Body>
                            <Row justify={"space-between"}>
                                <Text>{client.name}</Text>
                                <IconButton onClick={e => deleteHandler(e, client.id)}><Trash size="28" color="#f47373"/></IconButton>
                            </Row>
                            </Card.Body>
                        </Card>
                        <Spacer y={0.1}/>
                    </div>
                ))}

                {(loading || hasMore) &&
                    <Row justify={"center"}>
                        <Spacer/>
                        <div ref={scrollRef}>
                            <Loading/>
                        </div>
                    </Row>}
                <ModalCreateClient open={createClientIsOpen} onClose={closeHandler} onCreate={createHandler}/>
            </Container>
        </>

    )
}
