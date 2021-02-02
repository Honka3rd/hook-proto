import ReactDOM from "react-dom";
import React from "react";
import Main from "./main";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import BoundledReducers from "./reducers";
import {
	createStateSyncMiddleware,
	initStateWithPrevTab ,
} from "redux-state-sync";

const config = {};
const middlewares = [thunk, createStateSyncMiddleware(config)];
const store = createStore(
	BoundledReducers,
	{},
	applyMiddleware(...middlewares)
);
initStateWithPrevTab(store);
ReactDOM.render(
	<Provider store={store}>
		<Main />
	</Provider>,
	document.getElementById("root")
);
