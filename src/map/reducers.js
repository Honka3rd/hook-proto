import { UPDATE_CURRENT_MAP_INFO, LOAD_AMAP } from "./constants";
import _ from "lodash";

export const currentMapInfo = (state = null, action) => {
	if (action.type === UPDATE_CURRENT_MAP_INFO) {
		return _.cloneDeep(action.payload);
	}

	return state;
};

export const mapLoaded = (state = false, action) => {
    if(action.type === LOAD_AMAP) {
        return action.payload;
    }
    return state;
}
