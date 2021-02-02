import { combineReducers } from "redux";
import { verified } from "./Authentication";
import { currentMapInfo, mapLoaded } from "./map/reducers";
import { outCities } from "./MapHeader/reducers";
import {
	/* selectedRoute,
	selectedTrip, */
	selectedHook,
} from "./TrainPlatform/reducers";
import { withReduxStateSync } from "redux-state-sync";

const combinedReducers = combineReducers({
	verified,
	currentMapInfo,
	mapLoaded,
	/* selectedRoute,
	selectedTrip, */
	outCities,
	selectedHook,
});

export default withReduxStateSync(combinedReducers);
