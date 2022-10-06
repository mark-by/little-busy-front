import React from "react";
export default function Submit({title, className}) {
    return (
        <input type={"submit"} value={title} className={className}/>
    )
}
