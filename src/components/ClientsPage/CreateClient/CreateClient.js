import React from "react";
import PageHeader from "../../Utils/PageHeader/PageHeader";
import Input from "../../Utils/Input/Input";
import {useState} from "react";
import Submit from "../../Utils/Submit";
import "./CreateClient.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {API} from "../../../network/api";
import {toast} from "react-hot-toast";

export default function CreateClient() {
    const [data, setData] = useState({
        name: "",
        tel: ""
    });

    const navigate = useNavigate();

    const submitHandler = e => {
        e.preventDefault();
        axios.post(API.customers, data)
            .then(resp => {
                toast.success("Клиент создан");
                navigate(-1);
            })
            .catch(err => {
                toast.error("что-то пошло не так");
            })
    }
    return (
       <div className="create-client">
           <PageHeader title={"Создание клиента"}/>
           <form className="create-client__form" onSubmit={submitHandler}>
               <Input type="text" title="Имя" name="name" handler={setData}/>
               <Input type="text" title="Телефон" name="tel" handler={setData} placeholder="9991231212"/>
               <Submit title="Создать" className={"create-client__submit"}/>
           </form>
       </div>
    )
}
