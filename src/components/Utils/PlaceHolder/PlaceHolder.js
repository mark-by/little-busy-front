import React from "react";
import "./PlaceHolder.css";

export default function PlaceHolder({isLoading, emptyText}) {
    if (isLoading) {
        return <div className="place-holder">Загрузка..</div>
    }

    return <div className="place-holder">{emptyText ? emptyText : "Данных нет"}</div>
}
