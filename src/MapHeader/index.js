import React from "react";
import { connect } from "react-redux";
import { Dropdown, Grid, Button } from "semantic-ui-react";
import { capitals } from "../map/constants";
// import { sampleRoutes } from "../constants";
import { selectRoute } from "./actions";
import history from "../history";
import { routes } from "../constants";
import { updateCurrentMapInfo } from "../map/actions";

class MapHeader extends React.Component {
	provinces = [];
	provinceZoom = 5.5;
	cityZoom = 7.5;

	componentDidMount() {
		capitals.forEach((prov) => {
			this.provinces.push({
				key: prov.adcode,
				value: prov.adcode,
				text: prov.name,
				center: prov.center,
			});
		});
	}

	onProvinceChange = (e, { options, value }) => {
		const { text, center } = options.find((val) => {
			return val.key === value;
		});

		this.props.updateCurrentMapInfo({
			clickedProvinceObj: {
				name: text,
				center,
				adcode: value,
				level: "province",
			},
			clickedCityObj: null,
			center,
			zoom: this.provinceZoom,
			outControl: true,
		});
	};

	onCityChange = (e, { options, value }) => {
		const { text, center, citycode } = options.find((val) => {
			return val.key === value;
		});
		this.props.updateCurrentMapInfo({
			clickedProvinceObj: this.props.currentMapInfo.clickedProvinceObj,
			clickedCityObj: {
				name: text,
				center,
				adcode: value,
				citycode,
				level: "city",
			},
			center,
			zoom: this.cityZoom,
			outControl: true,
		});
	};

	state = {
		routeOptions: [],
	};

	onRouteChangeHandler = (e, { value }) => {
		this.props.selectRoute(value);
	};

	/* componentDidUpdate(preProps, preState) {
		const mapInfo = this.props.currentMapInfo;
		if (mapInfo.clickedCityObj) {
			if (!preState.routeOptions.length) {
				this.setState({ routeOptions: sampleRoutes });
			}
		} else {
			if (preState.routeOptions.length) {
				this.setState({ routeOptions: [] });
			}
		}
	} */

	configTrain = () => {
		history.push(routes.train_part_select);
	};

	mapCitiesToOptions = () => {
		return this.props.outCities.map((ct) => {
			const { adcode, name } = ct;
			return {
				key: adcode,
				value: adcode,
				text: name,
				...ct,
			};
		});
	};

	render() {
		const mapInfo = this.props.currentMapInfo;
		let provinceObj = null;
		let cityObj = null;
		if (mapInfo) {
			provinceObj = mapInfo.clickedProvinceObj;
            cityObj = mapInfo.clickedCityObj;
		}

		return (
			<Grid columns='equal'>
				<Grid.Column>
					<Dropdown
						placeholder='地图选择省份'
						fluid
						search
						selection
						options={this.provinces}
						onChange={this.onProvinceChange}
						value={provinceObj ? provinceObj.adcode : null}
						style={{ transform: "translateY(25%)" }}
						noResultsMessage='暂无省份'
					/>
				</Grid.Column>
				<Grid.Column>
					<Dropdown
						placeholder='地图选择市区'
						fluid
						search
						selection
						options={this.mapCitiesToOptions()}
						onChange={this.onCityChange}
						value={cityObj ? cityObj.adcode : null}
						style={{ transform: "translateY(25%)" }}
						noResultsMessage='暂无城市'
					/>
				</Grid.Column>
				<Grid.Column>
					<Dropdown
						placeholder='选择线路'
						fluid
						search
						selection
						disabled={!this.props.mapLoaded || !this.state.routeOptions.length}
						options={this.state.routeOptions}
						onChange={this.onRouteChangeHandler}
						value={this.props.selectedRoute}
						style={{ transform: "translateY(25%)" }}
						noResultsMessage='暂无线路'
					/>
				</Grid.Column>
				<Grid.Column>
					<Button
						content='进入列车系统'
						style={{ transform: "translateY(25%)" }}
						disabled={
							!(mapInfo && mapInfo.clickedProvinceObj) ||
							!(mapInfo && mapInfo.clickedCityObj) ||
							!mapInfo ||
							!this.props.selectedRoute ||
							!this.props.mapLoaded
						}
						onClick={this.configTrain}
					/>
				</Grid.Column>
			</Grid>
		);
	}
}

const mapStateToProps = ({
	currentMapInfo,
	mapLoaded,
	selectedRoute,
	outCities,
}) => {
	return { currentMapInfo, mapLoaded, selectedRoute, outCities };
};

export default connect(mapStateToProps, { selectRoute, updateCurrentMapInfo })(
	MapHeader
);
