import { SELECT_ROUTE } from "./constants";

export const selectRoute = (route) => {
    return {
        type: SELECT_ROUTE,
        payload: route
    }
}