import React from "react";
import { Route, HashRouter } from "react-router-dom";
// import history from "./history";
import LoginVerify from "./Authentication";
// import IPlatform from "./IntergrationPlatform";
import TrainPlatform from "./TrainPlatform";
import { routes } from "./constants";
import HookDetail from "./TrainPlatform/hookDetails";

class Main extends React.Component {
	render() {
		return (
			<HashRouter /* history={history} */>
				<Route path={routes.login_verify} exact component={LoginVerify}></Route>
				{/* <Route
					path={routes.location_select}
					exact
					component={IPlatform}></Route> */}
				<Route
					path={routes.train_part_select}
					exact
					component={TrainPlatform}></Route>
				<Route
					path={routes.hook_detail}
					exact
					component={HookDetail}></Route>
			</HashRouter>
		);
	}
}

export default Main;
