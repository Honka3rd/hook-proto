import { SELECT_ROUTE, GET_OUT_CITIES } from "./constants";

export const selectedRoute = (state = null, action) => {
	if (action.type === SELECT_ROUTE) {
		return action.payload;
	}
	return state;
};

export const outCities = (state = [], action) => {
	if (action.type === GET_OUT_CITIES) {
		return [...action.payload];
	}
	return state;
};
