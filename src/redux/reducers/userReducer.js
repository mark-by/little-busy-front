import {typesUser} from "../types";

const initState = {
    id: 0,
    isAdmin: false
}

export const userReducer = (state = initState, action) => {
   switch (action.type) {
       case typesUser.set:
           return action.payload;
       default:
           return state;
   }
}
