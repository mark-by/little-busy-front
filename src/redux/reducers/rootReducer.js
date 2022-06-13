import {combineReducers} from "redux";
import {userReducer} from "./userReducer";
import {settingsReducer} from "./settingsReducer";

export const rootReducer = combineReducers({
    user: userReducer,
    settings: settingsReducer,
})
