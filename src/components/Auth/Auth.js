import {useCallback, useState} from "react";
import axios from "axios";
import {API} from "../../network/api";
import {useDispatch} from "react-redux";
import {actionsUser} from "../../redux/actions";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {Button, Card, Container, Input, Row, Spacer, Text} from "@nextui-org/react";
import {inputChangeHandler} from "../../utils";

export default function Auth() {

    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = useCallback(e => {
        e.preventDefault();

        axios.post(API.session, data)
            .then(resp => {
                if (resp.status === 200) {
                    dispatch(actionsUser.set(resp.data));
                    navigate("/schedule")
                    return
                }
                toast.error(`что-то пошло не так: ${resp.status}`,);
            })
            .catch(err => {
                toast.error("не правильный логин и/или пароль")
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])


    return (
        <Container display={"flex"} css={{
            position: "fixed",
            left: "0",
            top: "0",
            right: "0",
            bottom: "0"
        }} justify={"center"} alignItems={"center"}>
            <Card css={{mw:"300px"}}>
                <Row justify={"center"}>
                    <Text h4>Войти</Text>
                </Row>
                <Spacer y={0.5}/>
                <form onSubmit={submitHandler}>
                    <Input width={"100%"} aria-label={"username"} underlined labelLeft={"username"} name={"username"} onChange={e => inputChangeHandler(e, setData)}/>
                    <Input type={"password"} width={"100%"} aria-label={"password"} underlined labelLeft={"password"} name={"password"} onChange={e => inputChangeHandler(e, setData)}/>
                    <Spacer/>
                    <Row justify={"center"}>
                        <Button type={"submit"}>Войти</Button>
                    </Row>
                </form>
            </Card>
        </Container>
        )
        // <div className={"auth-page"}>
        //     <div className="auth">
        //         <div className="auth__title">{isAuth ? "Войти" : "Создать"}</div>
        //         <form onSubmit={submitHandler}>
        //             <Input title="Логин" name="username" type="text" handler={setData}/>
        //             <Input title="Пароль" name="password" type="password" handler={setData}/>
        //
        //             <div className={"auth__control"}>
        //                 <Submit title={isAuth ? "Войти" : "Создать"} className={"auth__submit"}/>
        //                 <div className={"auth__control_toggle"} onClick={() => authToggle(!isAuth)}>{isAuth ? "создать" : "войти"}</div>
        //             </div>
        //         </form>
        //     </div>
        // </div>
}
