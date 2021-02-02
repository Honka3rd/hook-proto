import {
	/* SELECT_ROUTE,
	SELECT_TRIP,
	SELECT_CARRIAGE,
	GET_FAULT_CARRIAGES, */
	SELECT_HOOK,
} from "./constants";

/* export const selectedRoute = (state = null, action) => {
	if (action.type === SELECT_ROUTE) {
		return { ...action.payload };
	}
	return state;
};

export const selectedTrip = (state = null, action) => {
	if (action.type === SELECT_TRIP) {
		return action.payload;
	}
	return state;
};

export const selectedCarriage = (state = null, action) => {
	if (action.type === SELECT_CARRIAGE) {
		return { ...action.payload };
	}
	return state;
};

export const faultCarriages = (state = [], action) => {
	if (action.type === GET_FAULT_CARRIAGES) {
		return { ...action.payload };
	}
	return state;
}; */

export const selectedHook = (state = null, action) => {
	if (action.type === SELECT_HOOK) {
		return action.payload;
	}
	return state;
};
