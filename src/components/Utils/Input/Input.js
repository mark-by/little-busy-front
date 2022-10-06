import React from "react";
import {inputChangeHandler} from "../../../utils";
import "./Input.css";

export default function Input({type, title, name, handler, placeholder, value}) {
    return (
        <div className={"input"}>
            <p className={"input__title"}>{title}</p>
            <input
                type={type}
                name={name}
                defaultValue={value}
                onChange={e => inputChangeHandler(e, handler)}
                placeholder={placeholder}
            />
        </div>
    )
}
