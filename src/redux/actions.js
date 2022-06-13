import {typesSettings, typesUser} from "./types";

export const actionsUser = {
    set: (user) => ({type: typesUser.set, payload: user}),
}

export const actionsSettings = {
    set: (settings) => ({type: typesSettings.set, payload: settings}),
}
