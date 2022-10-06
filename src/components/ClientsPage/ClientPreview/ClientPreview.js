import React from "react";
import {useNavigate} from "react-router-dom";
import "./ClientPreview.css";

export default function ClientPreview({client}) {

    const navigate = useNavigate();

    const clickHandler = e => {
        navigate(`/clients/${client.id}`)
    }

    return (
        <div className="client" onClick={clickHandler}>
            <p>{client.name}</p>
        </div>
    )
}
