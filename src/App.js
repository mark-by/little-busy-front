import React from "react";
import Header from "./components/Header/Header";
import {Route, Routes} from "react-router-dom";
import Fish from "./components/Fish/Fish";
import {useEffect} from "react";
import axios from "axios";
import {API} from "./network/api";
import {useDispatch, useSelector} from "react-redux";
import {actionsSettings, actionsUser} from "./redux/actions";
import Auth from "./components/Auth/Auth";
import {toast, Toaster} from "react-hot-toast";
import ClientsPage from "./components/ClientsPage/ClientsPage";
import CreateClient from "./components/ClientsPage/CreateClient/CreateClient";
import ClientPage from "./components/ClientsPage/ClientPage/ClientPage";
import Schedule from "./components/Schedule/Schedule";
import CreateEvent from "./components/Schedule/CreateEvent";
import {Spacer} from "@nextui-org/react";
import FinancePage from "./components/Finance/FinancePage";
import UpdateEvent from "./components/Schedule/UpdateEvent";
import SettingsPage from "./components/Settings/SettingsPage";
import RecordsPage from "./components/Finance/RecordsPage/RecordsPage";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(API.user)
            .then(resp => {
                if (resp.status === 200) {
                    dispatch(actionsUser.set(resp.data))
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Что-то я вас не признал :(")
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axios.get(API.settings)
            .then(resp => {
                if (resp.status === 200) {
                    dispatch(actionsSettings.set({startWork: resp.data.start_work_hour, endWork: resp.data.end_work_hour, defaultPricePerHour: resp.data.default_price_per_hour}))
                }
            })
            .catch(err => {
                toast.error("Не получилось вспомнить настройки :|")
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const user = useSelector(state => state.user);
    if (!user.id) {
        return (
            <>
                <Toaster/>
                <Auth/>
            </>
        )
    }

  return (
          <div className="app">
              <Toaster/>
              <Routes>
                  <Route index path="/" element={<Schedule/>}/>
                  <Route path="clients" element={<ClientsPage/>}/>
                  <Route path="clients/new" element={<CreateClient/>}/>
                  <Route path="clients/:id" element={<ClientPage/>}/>
                  <Route index path="finance" element={<FinancePage/>}/>
                  <Route index path="finance/history" element={<RecordsPage/>}/>

                  <Route index path="settings" element={<SettingsPage/>}/>

                  <Route index path="schedule" element={<Schedule/>}/>
                  <Route index path="schedule/new" element={<CreateEvent/>}/>
                  <Route index path="schedule/new/:year/:month/:day/:hour" element={<CreateEvent/>}/>
                  <Route index path="schedule/:id/:date" element={<UpdateEvent/>}/>

                  <Route path="auth" element={<Fish/>}/>
              </Routes>
              <Spacer y={3}/>
              <Header/>
          </div>
  );
}

export default App;