import React from "react";
import { Segment, Dropdown, Button, Grid } from "semantic-ui-react";
import $ from "jquery";
import { bmapApiKey, bmapScript } from "./constants";

class RouteMapState extends React.Component {
	container = "bMap_container";

	state = {
		lines: [],
		selectedLine: null,
		marked: false,
	};

	componentDidMount() {
		$.getScript(`${bmapScript}&ak=${bmapApiKey}`, this.onSubwayMapScriptLoaded);
	}

	onSubwayMapScriptLoaded = () => {
		const subwayCityName = "上海";
		const BMapSub = window.BMapSub;
		const height = this.props.height;
		if (BMapSub) {
			const list = BMapSub.SubwayCitiesList;
			let subwaycity = null;
			for (let i = 0, len = list.length; i < len; i++) {
				if (list[i].name === subwayCityName) {
					subwaycity = list[i];
					break;
				}
			}

			if (subwaycity) {
				const subway = new BMapSub.Subway(this.container, subwaycity.citycode);
				const zoomControl = new BMapSub.ZoomControl({
					anchor: window.BMAPSUB_ANCHOR_BOTTOM_RIGHT,
					offset: new BMapSub.Size(height * 0.1, height * 0.3),
				});
				subway.addControl(zoomControl);
				subway.addEventListener("subwayloaded", () => {
					this.onSubwayMapComplete(subway);
				});
				subway.addEventListener(
					"directioncomplete",
					this.onSubwaySearchComplete
				);

				this.subway = subway;
				this.BMapSub = BMapSub;
			}
		}
	};

	// markers = [];
	onSubwayMapComplete = (subway) => {
		const lines = subway.getLines();
		this.setState({ lines });
		/* for (let line of lines) {
			for (let station of line.stations) {
				const marker = new this.BMapSub.Marker(station.name);
				this.subway.addMarker(marker);
				this.markers.push(marker);
				marker.hide();
			}
		} */
	};

	hideAllMarkers = () => {
		/* for (let marker of this.markers) {
			this.setState({ marked: false });
			marker.hide();
		} */
		this.subway.clearMarkers();
	};

	currentStations = [];
	searchSubwayline = (line) => {
		if (this.subway && this.BMapSub) {
			// this.hideAllMarkers();
			const drct = new this.BMapSub.Direction(this.subway, {
				drctRenderOptions: {
					detailText: "标记线路",
					detailClass: "subway-station-marker",
				},
			});
			const stations = line.stations;
			const len = stations.length;
			drct.search(stations[0].name, stations[len - 1].name);
			this.currentStations = stations;
		}
	};

	onSubwayLineChange = (e, { value }) => {
		for (let line of this.state.lines) {
			if (line.name === value) {
				this.setState({ selectedLine: line });
			}
		}
	};

	onSubwaySearchComplete = () => {
		for (let station of this.currentStations) {
			const marker = new this.BMapSub.Marker(station.name);
			this.subway.addMarker(marker);
			if (!this.state.marked) {
				this.setState({ marked: true });
			}
		}
	};

	componentDidUpdate(preProps, preState) {
		if (
			preState.selectedLine !== this.state.selectedLine &&
			this.state.selectedLine
		) {
			if (this.state.lines.length) {
				for (let line of this.state.lines) {
					if (line.name === this.state.selectedLine.name) {
						const pannel = $(".direction_panel").first()[0];
						const close_1 = $(".direction_close").first()[0];

						if (pannel) {
							$(pannel).remove();
						}

						if (close_1) {
							$(close_1).remove();
						}

						this.searchSubwayline(line);

						break;
					}
				}
			}
		}

		if (this.state.selectedLine) {
			this.loop = window.setInterval(() => {
				const $close = $(".direction_close");
				if ($close.length) {
					this.attachCloseEvent($close);
					$(".subway-station-marker").css("cursor", "pointer");
					window.clearInterval(this.loop);
				}
			}, 25);
		}
	}

	componentWillUnmount() {
		if (this.loop) {
			window.clearInterval(this.loop);
		}
	}

	attachCloseEvent = ($close) => {
		const global = this;
		$close.each(function () {
			const _this = global;
			$(this).on("mousedown", function () {
				_this.setState({ selectedLine: null });
			});
		});
	};

	render() {
		const lineName = this.state.selectedLine
			? this.state.selectedLine.name
			: "";
		return [
			<Segment
				id={this.container}
				key={0}
				style={{
					height: this.props.height,
				}}></Segment>,

			<Grid
				key={1}
				style={{ position: "absolute", top: "1%", left: "1%", width: "40%" }}>
				<Grid.Row columns={2}>
					<Grid.Column width={10}>
						<Dropdown
							key={1}
							placeholder='选择线路'
							fluid
							search
							selection
							onChange={this.onSubwayLineChange}
							value={lineName}
							options={
								this.state.lines.length
									? this.state.lines.map(({ name }) => {
											return {
												key: name,
												text: name,
												value: name,
											};
									  })
									: []
							}
						/>
					</Grid.Column>
					<Grid.Column width={6}>
						<Button
							basic
							disabled={!this.state.marked}
							fluid
							onClick={this.hideAllMarkers}>
							清除标记
						</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>,
		];
	}
}

export default RouteMapState;
