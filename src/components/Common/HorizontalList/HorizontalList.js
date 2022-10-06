import React from "react";
import './HorizontalList.css';

export default function HorizontalList({list, title, click, current, width}) {
    const ref = React.useRef(null);

    return (
        <div ref={ref} className="horizontal-list" style={width ? {width: `${width}px`} : {}} onWheel={event => {
            ref.current.scrollBy(event.deltaY, 0)}}>
            {list.map((item, idx) => (
                <div className={"horizontal-list__item" + (current(item, idx) ? " active" : "")} onClick={() => click(item, idx)}>
                    { title(item) }
                </div>
            ))}
        </div>
    )
}
