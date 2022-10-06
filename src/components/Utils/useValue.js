import {useState} from "react";

export default function useValue(init) {
    const [value, setValue] = useState(init);
    return {
        value,
        setValue
    }
}
