import React from "react";
import {useRef, useState} from "react";
import {Input, Text} from "@nextui-org/react";
import {IconButton} from "../IconButton";
import {ArrowDown2, ArrowUp2} from "iconsax-react";

//api должно возвращать json вида {results: [{id: 4, text: "sample"}, ...]}
export default function Select({name, setSelected, options, selected, title, width, }) {
    const [isOpen, toggle] = useState(false);

    function handleSelectOption(option) {
       setSelected(option)
        toggle(false);
    }

    function closeHandler(e) {
            toggle(prev => !prev)
    }

    const inputRef = useRef(null);

    return (
        <div className="select" ref={inputRef}>
            <Input css={{width: width}} onClick={e => closeHandler(e)} fullWidth readOnly value={selected ? selected.title : title}
                   contentRight={<IconButton>
                       {isOpen ? <ArrowUp2 color="#555555" variant="Bold"/> :
                       <ArrowDown2 color="#555555" variant="Bold"/>}
            </IconButton>}/>
            {isOpen && <div className="options" style={{width: inputRef.current ? `${inputRef.current.offsetWidth}px` : ""}}>
                <div style={{maxHeight: "200px", overflowY: "scroll", paddingLeft: "5px"}}>
                    {options && options.map((option, idx) => {
                        return <Text css={{p: "4px"}} key={idx} onClick={() => handleSelectOption(option)}>
                            {option.title}
                        </Text>
                    })}
                </div>
            </div>}
        </div>
    )
}
