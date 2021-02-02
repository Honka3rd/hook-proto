import React from "react";
import { Map, Marker } from "react-amap";
import $ from "jquery";
import { Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { loadAMap, updateOutCities } from "./actions";

class AMap extends React.Component {
	map = null;
	marks = [];

	constructor() {
		super();

		this.amapEvents = {
			created: (mapInstance) => {
				if (!this.map) {
					this.map = mapInstance;
				}

				mapInstance.on("zoomend", this.mapZoomChangeHandler);
				mapInstance.on("moveend", this.mapMoveHandler);
				mapInstance.on("complete", this.onMapLoadComplete);
			},
		};

		this.markEvents = {
			created: (markInstance) => {
				this.collectMarks(markInstance);
				markInstance.on("click", this.markClickHandler);
				markInstance.on("mouseover", this.markHoverHandler);
				markInstance.on("mouseout", this.markOutHandler);
			},
		};

		window.distChangeHandler = this.markClickHandler;
	}

	getMarkObj = (e) => {
		const targetMark = e.target;
		return this.state.markList.find((mark) => {
			const position = targetMark.getPosition();
			return (
				JSON.stringify(mark.center) ===
				JSON.stringify([position.lng, position.lat])
			);
		});
	};

	provDone = false;
	cityDone = false;
	markClickHandler = (e) => {
		if (!this.state.mapLoaded) return;
		const lnglat = e.lnglat;
		const d = this.getMarkObj(e);
		this.updateMap(lnglat, d);
	};

	updateMap = (lnglat, d) => {
		if (this.state.disableBackward) {
			this.setState({ disableBackward: false });
		}
		if (!this.provDone && !this.cityDone) {
			this.provDone = true;
			this.cityDone = false;

			this.mapInfo = {
				clickedProvinceObj: d,
				zoom: this.provinceZoom,
				center: [lnglat.lng, lnglat.lat],
				clickedCityObj: null,
			};
			this.props.updateCurrentMapInfo(this.mapInfo);
			this.searchDistrict(d, "province");
			return;
		}

		if (!this.cityDone && this.provDone) {
			this.searchDistrict(d, "city");
			this.updateMapInfo("center", [lnglat.lng, lnglat.lat]);
			this.updateMapInfo("zoom", this.cityZoom);
			this.updateMapInfo("clickedCityObj", d);
			this.props.updateCurrentMapInfo(this.mapInfo);
			this.cityDone = true;
			return;
		}

		if (this.cityDone && this.provDone) {
			this.searchDistrict(d, "city");
			this.setState({ disableBackward: false });
			this.updateMapInfo("center", [lnglat.lng, lnglat.lat]);
			this.updateMapInfo("clickedCityObj", d);
			this.props.updateCurrentMapInfo(this.mapInfo);
		}
	};

	markHoverHandler = (e) => {
		if (!this.state.mapLoaded) return;
		const dist = this.getMarkObj(e);
		this.setState({ currentDist: dist });
	};

	markOutHandler = () => {
		if (!this.state.mapLoaded) return;
		const infoWin = this.infoWindow;
		if (infoWin) {
			this.setState({ currentDist: null });
			infoWin.close();
			this.removeInfoDom();
			this.removeInfoWindow();
		}
	};

	mapZoomChangeHandler = () => {
		/* if (!this.state.mapLoaded) return;
		if (this.props.currentMapInfo.outControl) return;
		const zoom = this.map.getZoom();
		this.updateMapInfo("zoom", zoom);
		this.props.updateCurrentMapInfo(this.mapInfo); */
	};

	mapMoveHandler = () => {
		/* if (!this.state.mapLoaded) return;
		if (this.props.currentMapInfo.outControl) return;
		const center = this.map.getCenter();
		const lng = center.lng;
		const lat = center.lat;
		if (this.mapInfo.center[0] === lng && this.mapInfo.center[1] === lat)
			return;
		this.updateMapInfo("center", [lng, lat]);
		this.props.updateCurrentMapInfo(this.mapInfo); */
	};

	infoWindow = null;
	infoWinDom = null;
	createInfoDom = () => {
		this.infoWinDom = document.createElement("div");
		$(this.infoWinDom).addClass("ui info message");
		$(this.infoWinDom).append("<div></div>");
		const $content = $(this.infoWinDom).children().first();
		$content.addClass("content");
		$content.append("<div></div>");
		$content.append("<p></p>");
		const $header = $content.children().first();
		$header.addClass("header");
		$(this.infoWinDom).css({ padding: 8, opacity: 0.7 });
	};

	removeInfoDom = () => {
		$(this.infoWinDom).remove();
		this.infoWinDom = null;
	};

	district = null;
	onMapLoadComplete = () => {
		this.setState({ mapLoaded: true });
		this.props.loadAMap(true);
		const focusConfig = {
			subdistrict: 1,
			showbiz: false,
		};
		window.AMap.plugin("AMap.DistrictSearch", () => {
			this.props.loadAMap(true);
			window.outControlMap = false;
			this.district = new window.AMap.DistrictSearch(focusConfig);
		});
	};

	createInfoWindow = () => {
		this.infoWindow = new window.AMap.InfoWindow({
			isCustom: true,
			content: this.infoWinDom.outerHTML,
			anchor: "bottom-center",
			offset: new window.AMap.Pixel(0, -20),
		});
	};

	removeInfoWindow = () => {
		this.infoWindow = null;
	};

	insertInfoWinContent = (currentDist) => {
		const $infoWinInner = $(this.infoWinDom).children().first().children();
		$infoWinInner.first().html(currentDist.name);
		$infoWinInner.last().html(`区域代号:${currentDist.adcode}`);
	};

	polygons = [];
	searchDistrict = (parent, level) => {
		if (!this.district) {
			return;
		}

		this.cleanPolygon();
		this.district.setLevel(level);
		this.district.setExtensions("all");

		this.district.search(parent.adcode, (status, result) => {
			if (status === "complete") {
				const resList = result.districtList[0];
				this.depictPolygon(resList);
				if (this.cityDone) {
					return;
				}
				this.mapInfo.clickedProvinceObj["districtList"] = resList.districtList;
				this.props.updateCurrentMapInfo(this.mapInfo);
				const children = [];
				if (resList.districtList) {
					resList.districtList.forEach((dist) => {
						this.loadChildren(children, dist);
					});
				}
				this.props.updateOutCities(children);
				this.setState({ markList: children });
			}
		});
	};

	loadChildren = (children, dist) => {
		const center = dist.center;
		children.push({
			adcode: dist.adcode,
			citycode: dist.citycode,
			name: dist.name,
			center: [center.lng, center.lat],
		});
	};

	cleanPolygon = () => {
		for (let i = 0, l = this.polygons.length; i < l; i++) {
			this.polygons[i].setMap(null);
		}
	};

	depictPolygon = (data) => {
		const bounds = data.boundaries;
		if (bounds) {
			for (let i = 0, l = bounds.length; i < l; i++) {
				const polygon = new window.AMap.Polygon({
					map: this.map,
					strokeWeight: 1,
					strokeColor: "#2185d0",
					fillColor: "#2185d0",
					fillOpacity: 0.2,
					path: bounds[i],
				});
				this.polygons.push(polygon);
			}
		}
	};

	collectMarks = (markInstance) => {
		if (!this.marks.find((mark) => markInstance === mark)) {
			this.marks.push(markInstance);
		}
	};

	componentWillUnmount() {
		if (this.map) {
			this.map.off("zoomchange", this.mapZoomChangeHandler);
			this.map.off("moveend", this.mapMoveHandler);
		}

		if (this.marks.length) {
			for (let mark of this.marks) {
				mark.off("click", this.markClickHandler);
				mark.off("mouseover", this.markHoverHandler);
				mark.off("mouseout", this.markOutHandler);
			}
		}

		// this.map.destory();
	}

	defaultCenter = [105.249413, 36.511004];
	defaultZoom = 4;
	provinceZoom = 5.5;
	cityZoom = 7.5;
	state = {
		/* clientX: 0,
		clientY: 0, */
		mapLoaded: false,
		currentDist: null,
		markList: [],
		disableBackward: true,
	};

	mapInfo = {
		clickedProvinceObj: null,
		clickedCityObj: null,
		zoom: this.defaultZoom,
		center: this.defaultCenter,
	};

	updateMapInfo = (key, value) => {
		this.mapInfo[key] = value;
	};

	renderMarkers = () => {
		const { provinceMarks } = this.props;
		if (!provinceMarks || (provinceMarks && !provinceMarks.length)) {
			return null;
		}

		return this.state.markList.map((geo, i) => {
			const accord = geo.center;
			return (
				<Marker
					position={{ longitude: accord[0], latitude: accord[1] }}
					events={this.markEvents}
					key={i}
				/>
			);
		});
	};

	recoverMapState = () => {
		this.setState({
			currentDist: null,
			markList: this.props.provinceMarks,
		});

		this.mapInfo = {
			clickedProvinceObj: null,
			clickedCityObj: null,
			zoom: this.defaultZoom,
			center: this.defaultCenter,
		};

		this.props.updateCurrentMapInfo(this.mapInfo);

		this.provDone = false;
		this.cityDone = false;
		this.cleanPolygon();
	};

	shouldDisableRecoverBtn = () => {
		let disableRecover = false;
		const { zoom, center } = this.mapInfo;
		if (
			zoom === this.defaultZoom &&
			JSON.stringify(center) === JSON.stringify(this.defaultCenter)
		) {
			disableRecover = true;
		}
		return disableRecover;
	};

	goHigherLevel = () => {
		if (this.provDone && this.cityDone) {
			const center = this.mapInfo.clickedProvinceObj.center;
			this.updateMapInfo("zoom", this.provinceZoom);
			this.updateMapInfo("center", center);
			this.updateMapInfo("clickedCityObj", null);
			this.cleanPolygon();
			this.searchDistrict(this.mapInfo.clickedProvinceObj, "province");
			this.props.updateCurrentMapInfo(this.mapInfo);

			this.provDone = true;
			this.cityDone = false;
			return;
		} else if (this.provDone && !this.cityDone) {
			this.recoverMapState();
			this.setState({ disableBackward: true });
		}
	};

	// mapRef = React.createRef();

	componentDidMount() {
		// const $map = $(this.mapRef.current);
		/* this.setState({
			clientX: $map.width(),
			clientY: $map.height(),
		}); */
		this.props.updateCurrentMapInfo({
			clickedProvinceObj: null,
			clickedCityObj: null,
			zoom: this.defaultZoom,
			center: this.defaultCenter,
		});
		this.setState({ markList: [...this.props.provinceMarks] });
	}

	componentDidUpdate(preProps, preState) {
		const { currentDist } = this.state;
		if (preState.currentDist !== currentDist && currentDist) {
			this.createInfoDom();
			this.insertInfoWinContent(currentDist);
			this.createInfoWindow();
			const infoWin = this.infoWindow;
			if (infoWin) {
				infoWin.open(this.map, [currentDist.center[0], currentDist.center[1]]);
			}
		}

		const currentMapInfo = this.props.currentMapInfo;
		if (preProps.currentMapInfo !== currentMapInfo) {
			if (currentMapInfo.outControl) {
				if (
					currentMapInfo.clickedProvinceObj &&
					!currentMapInfo.clickedCityObj &&
					currentMapInfo.clickedProvinceObj.level === "province"
				) {
					this.provDone = true;
					this.cityDone = false;
					this.mapInfo = currentMapInfo;
					this.props.updateOutCities([]);
					this.cleanPolygon();
					this.district.setLevel("province");
					this.district.setExtensions("all");
					this.district.search(
						currentMapInfo.clickedProvinceObj.adcode,
						(status, result) => {
							if (status === "complete") {
								const resList = result.districtList[0];
								this.depictPolygon(resList);
								const children = [];
								if (resList.districtList) {
									resList.districtList.forEach((dist) => {
										this.loadChildren(children, dist);
									});
								}
								this.props.updateOutCities(children);
								this.setState({ markList: children });
							}
						}
					);
					if (this.state.disableBackward) {
						this.setState({ disableBackward: false });
					}
				}

				if (
					currentMapInfo.clickedProvinceObj &&
					currentMapInfo.clickedCityObj &&
					currentMapInfo.clickedCityObj.level === "city"
				) {
					this.provDone = true;
					this.cityDone = true;
					this.mapInfo = currentMapInfo;
					this.cleanPolygon();
					this.district.setLevel("city");
					this.district.setExtensions("all");
					this.district.search(
						currentMapInfo.clickedCityObj.adcode,
						(status, result) => {
							if (status === "complete") {
								const resList = result.districtList[0];
								this.depictPolygon(resList);
							}
						}
					);
				}
			}
		}
	}

	plugins = [
		{
			name: "ToolBar",
			options: {
				visible: true,
			},
		},
	];

	render() {
		return [
			<Button.Group
				key={0}
				style={{ position: "absolute", zIndex: 1, right: "20px", top: "20px" }}>
				<Button
					icon
					disabled={this.shouldDisableRecoverBtn()}
					onClick={this.recoverMapState}>
					<Icon name='world' />
				</Button>
				<Button
					icon
					onClick={this.goHigherLevel}
					disabled={this.state.disableBackward}>
					<Icon name='backward' />
				</Button>
			</Button.Group>,
			<Map
				key={1}
				amapkey={this.props.amapKey}
				events={this.amapEvents}
				mapStyle='amap://styles/darkblue'
				center={
					this.props.currentMapInfo
						? this.props.currentMapInfo.center
						: this.defaultCenter
				}
				viewMode='2D'
				plugins={this.plugins}
				zoom={
					this.props.currentMapInfo
						? this.props.currentMapInfo.zoom
						: this.defaultZoom
				}>
				{this.renderMarkers()}
			</Map>,
		];
	}
}

const mapStateToProps = ({ currentMapInfo, outCities }) => {
	return { currentMapInfo, outCities };
};

export default connect(mapStateToProps, { loadAMap, updateOutCities })(AMap);
