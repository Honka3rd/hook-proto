import {
	/* SELECT_ROUTE,
	SELECT_TRIP,
	SELECT_CARRIAGE,
	GET_FAULT_CARRIAGES, */
	SELECT_HOOK
} from "./constants";

/* export const selectRoute = (route) => {
	return {
		type: SELECT_ROUTE,
		payload: route,
	};
};

export const selectTrip = (trip) => {
	return {
		type: SELECT_TRIP,
		payload: trip,
	};
};

export const selectCarriage = (carriageCode) => {
	return {
		type: SELECT_CARRIAGE,
		payload: carriageCode,
	};
};

export const getFaultCarriage = (carriages) => {
	return {
		type: GET_FAULT_CARRIAGES,
		payload: carriages,
	};
}; */

export const selectHook = (hook) => {
	return {
		type: SELECT_HOOK,
		payload: hook,
	};
}
