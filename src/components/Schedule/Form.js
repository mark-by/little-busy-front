import React from "react";
import {inputChangeHandler} from "../../utils";
import {Button} from "@nextui-org/react";

export default function Form({close, date}) {
    const [times, setTimes] = React.useState([]);
    const [inputData, setInputData] = React.useState({time: "8:00"});
    React.useEffect(() => {
        const times = [];
        for (let h = 8; h < 19; h++) {
            times.push(`${h}:00`)
            times.push(`${h}:30`)
        }
        times.push(`19:00`)

        setTimes(times);
    }, [])

    function submitHandler(e) {
        e.preventDefault();
    }

    function normalizeNumber(num) {
        if (num < 10) {
            return "0" + num
        } else {
            return num + ""
        }
    }

    return (
       <div className="wrapper" onClick={e => {if (e.target.className === "wrapper") close()}}>
           <form className="schedule__form" onSubmit={submitHandler}>
               <div className="close-button" onClick={close}>
                   x
               </div>
               <h4 style={{color: "gray"}}>Выбранная дата: {normalizeNumber(date.currDay)}.{normalizeNumber(date.currMonth)}.{date.currYear}</h4>
               <h3>Во сколько хотели бы прийти?<span className="asterik">*</span></h3>
               <select name="time" onChange={e => inputChangeHandler(e, setInputData)} required={true}>
                   {times.map((time, idx) => (
                       <option value={time} key={idx}>{time}</option>
                   ))}
               </select>
               <h3>Какие проблемы хотите решить?</h3>
               <textarea placeholder="Здесь можете написать, что Вас волнует. Проблемы, диагнозы и прочее" name="description" onChange={e => inputChangeHandler(e, setInputData)}/>
               <h3>Ваше имя<span className="asterik">*</span></h3>
               <input type="text" name="name" onChange={e => inputChangeHandler(e, setInputData)} required={true}/>
               <h3>Ваш телефон<span className="asterik">*</span></h3>
               <input type="number" name="tel" onChange={e => inputChangeHandler(e, setInputData)} required={true}/>
               <p style={{color: "gray", marginTop: "10px"}}>Я обязательно перезвоню Вам в течение дня</p>
               <p style={{color: "gray", marginTop: "10px"}}>* - обязательное поле</p>
               <div className="bottom-control">
                   <Button type={"submit"}>Записаться</Button>
                   {/*<Submit>Записаться</Submit>*/}
               </div>
           </form>
       </div>
    )
}
