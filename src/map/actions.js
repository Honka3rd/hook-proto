import { UPDATE_CURRENT_MAP_INFO, LOAD_AMAP } from "./constants";
import { GET_OUT_CITIES } from "../MapHeader/constants";

export const updateCurrentMapInfo = (info) => {
    return {
        type: UPDATE_CURRENT_MAP_INFO,
        payload: info
    }
}

export const loadAMap = (loaded) => {
    return {
        type: LOAD_AMAP,
        payload: loaded
    }
}

export const updateOutCities = (cities) => {
    return {
        type: GET_OUT_CITIES,
        payload: cities
    }
}