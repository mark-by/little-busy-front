import './Select.css'
import axios from "axios";
import {useState} from "react";
import {Input, Text} from "@nextui-org/react";
import {IconButton} from "../IconButton";
import {ArrowDown2, ArrowUp2} from "iconsax-react";

import React from "react";

//api должно возвращать json вида {results: [{id: 4, text: "sample"}, ...]}
export default function AutoSelect({name, setSelected, title, api, width, selected, }) {
    const [isOpen, toggle] = useState(false);
    const [suggestions, setSuggestions] = useState(null);

    function handleSelectOption(option) {
       setSelected(option)
        toggle(false);
    }

    function closeHandler(e) {
            if (!suggestions) {
                axios.get(api)
                    .then(response => {
                            setSuggestions(response.data)
                        }
                    )
            }
            toggle(prev => !prev)
    }

    function searchInputHandler(e) {
        axios.get(api, {params: {searchText: e.target.value}})
            .then(response => {
                    setSuggestions(response.data)
                }
            )
    }

    return (
        <div className="select" style={{width: width}}>
            <Input onClick={e => closeHandler(e)} fullWidth readOnly value={selected ? selected.name : title}
                   contentRight={<IconButton>
                       {isOpen ? <ArrowUp2 color="#555555" variant="Bold"/> :
                       <ArrowDown2 color="#555555" variant="Bold"/>}
            </IconButton>}/>
            {isOpen && <div className="options">
                <Input type={"search"} fullWidth underlined onChange={searchInputHandler} placeholder="Введите для поиска"/>
                <div style={{maxHeight: "200px", overflowY: "scroll", paddingLeft: "10px"}}>
                    {(!suggestions || !suggestions.length) && <div className="option">Нет предложений</div>}
                    {suggestions && suggestions.map((option, idx) => {
                        return <Text css={{p: "4px"}} key={idx} onClick={() => handleSelectOption(option)}>
                            {option.name}
                        </Text>
                    })}
                </div>
            </div>}
        </div>
    )
}
