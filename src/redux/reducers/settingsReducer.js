import {typesSettings} from "../types";

const initState = {
    startWork: 8,
    endWork: 22,
    defaultPricePerHour: 1000,
}

export const settingsReducer = (state = initState, action) => {
   switch (action.type) {
       case typesSettings.set:
           return action.payload;
       default:
           return state;
   }
}
