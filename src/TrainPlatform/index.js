import React from "react";
import {
	Segment,
	Grid,
	Sidebar,
	// Menu,
	// Dropdown,
	// Checkbox,
	Button,
	Header,
	Icon,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { connect } from "react-redux";
import { BASE_CONFIG_URL } from "./constants";
import Axios from "axios";
import $ from "jquery";
import { ResizeSensor } from "css-element-queries";
import "../FontEffects/chinese_char_design.css";
import { routes } from "../constants";
// import { selectRoute, selectTrip } from "./actions";
import { verifyAuthInfo } from "../Authentication"
import TrainState from "./subComponents/trainState";
import RouteMapState from "./subComponents/routeMapState";
import MalfuncStatistic from "./subComponents/malfuncStatistic";

import CarriageSelector from "./subComponents/carriageSelector";

import FaultStatisticsSummary from "./subComponents/faultStatisticsSummary";
import WarningStatistic from "./subComponents/warningStatistic";
import WaringProcessingStatu from "./subComponents/waringProcessingStatu";
import FailureTypeStatistics from "./subComponents/failureTypeStatistics";

class TrainPlatform extends React.Component {
	state = {
		mainHeight: window.innerHeight,
		mainWidth: window.innerWidth,
		visible: false,
		routeData: null,
		routeChildren: [],
		canvasWidth: 0,
	};

	constructor(props) {
		super(props);
		this.axiosInstance = Axios.create({
			baseURL: BASE_CONFIG_URL,
		});
		if(!props.verified) {
			props.history.push(routes.login_verify);
		}
	}

	handleResponse = (res) => {
		if (res) {
			if (res.status === 200 && res.data) {
				const data = res.data;
				if (data.code === 200 && data.data) {
					try {
						return $.parseJSON(data.data);
					} catch (err) {
						console.log("response parse error", err);
					}
				} else {
					console.log(
						"response code or data error",
						`code: ${data.code}`,
						`data: ${data.data}`
					);
				}
			} else {
				console.log(
					"response status or data error",
					`status: ${res.status}`,
					`data: ${res.data}`
				);
			}
		} else {
			console.log("no response error");
		}

		return null;
	};

	headerCanvasId = "train_plt_header";
	componentDidMount() {
		if (this.props.verified) {
			const headerCanvas = document.getElementById(this.headerCanvasId);
			let offsetWidth = $(headerCanvas).parent()[0].offsetWidth;
			this.setState({ canvasWidth: offsetWidth });

			new ResizeSensor($("body"), () => {
				offsetWidth = $(headerCanvas).parent()[0].offsetWidth;
				this.setState({
					mainHeight: window.innerHeight,
					mainWidth: window.innerWidth,
					canvasWidth: offsetWidth,
				});
			});
		}
	}

	componentDidUpdate(preProps, preState) {
		if (
			preState.canvasWidth !== this.state.canvasWidth ||
			preState.mainHeight !== this.state.mainHeight
		) {
			this.depictHeader();
		}
	}

	depictHeader = () => {
		const headerCanvas = document.getElementById(this.headerCanvasId);
		if (!headerCanvas) {
			return;
		}
		const headerContext = headerCanvas.getContext("2d");
		const { width, height } = headerCanvas;
		this.clearHeaderDepict(headerContext, width, height);
		headerContext.beginPath();
		headerContext.strokeStyle = "#7ED5EA";
		headerContext.shadowColor = "#4B9FE1";
		headerContext.shadowBlur = 2;
		headerContext.lineWidth = 1;
		headerContext.moveTo(0, height * 0.1);
		headerContext.lineTo(width * 0.35, height * 0.1);
		headerContext.lineTo(width * 0.4, height * 0.8);
		headerContext.lineTo(width * 0.6, height * 0.8);
		headerContext.lineTo(width * 0.65, height * 0.1);
		headerContext.lineTo(width, height * 0.1);
		headerContext.stroke();
		headerContext.closePath();

		headerContext.beginPath();
		headerContext.strokeStyle = "RGBA(126,213,234,0.6)";
		headerContext.lineWidth = 0.5;
		headerContext.shadowBlur = 1;
		headerContext.moveTo(width * 0.3, height * 0.18);
		headerContext.lineTo(width * 0.35, height * 0.18);
		headerContext.lineTo(width * 0.4, height * 0.88);
		headerContext.lineTo(width * 0.425, height * 0.88);
		headerContext.stroke();
		headerContext.closePath();

		headerContext.beginPath();
		headerContext.moveTo(width * 0.575, height * 0.88);
		headerContext.lineTo(width * 0.6, height * 0.88);
		headerContext.lineTo(width * 0.65, height * 0.18);
		headerContext.lineTo(width * 0.7, height * 0.18);
		headerContext.stroke();
		headerContext.closePath();
	};

	clearHeaderDepict = (headerContext, width, height) => {
		if (headerContext) {
			headerContext.clearRect(0, 0, width, height);
		}
	};

	outSystem = () => {
		this.props.verifyAuthInfo(false);
		setTimeout(() => {
			this.props.history.push(routes.login_verify);
		})
	};

	renderHeader = (currentMapInfo, selectedRoute, selectedTrain) => {
		return (
			<Grid>
				<Grid.Row columns={6}>
					<Grid.Column width='2'></Grid.Column>
					<Grid.Column width='4'>
						<Header
							as='h5'
							style={{
								transform: "translate(0, 50%)",
								textAlign: "center",
								color: "aliceblue",
								fontFamily: "chinese_char_design",
							}}>
							线路信息: {selectedRoute ? selectedRoute.text : ""}
						</Header>
					</Grid.Column>
					<Grid.Column width='4'>
						<Header
							style={{
								textAlign: "center",
								color: "aliceblue",
								fontFamily: "chinese_char_design",
							}}>
							钩缓数据监控系统
						</Header>
					</Grid.Column>
					<Grid.Column width='2'>
						<Header
							as='h5'
							style={{
								transform: "translate(0, 50%)",
								textAlign: "center",
								color: "aliceblue",
								fontFamily: "chinese_char_design",
							}}>
							车辆信息: {selectedTrain ? `${selectedTrain}号车` : ""}
						</Header>
					</Grid.Column>
					<Grid.Column width='2'></Grid.Column>
					<Grid.Column width='2'>
						<Button
							floated='right'
							onClick={this.outSystem}
							inverted
							style={{ fontFamily: "chinese_char_design" }}
							color='blue'>
							<Icon name='sign out' />
							退出系统
						</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	};

	renderMainPannel = () => {
		const { mainHeight } = this.state;
		return (
			<Grid columns={2}>
				<Grid.Column width={16}>
					<Grid>
						<Grid.Row columns={3} style={{ paddingBottom: 0 }}>
							<Grid.Column width={4}>
								<TrainState height={mainHeight * 0.35} />
							</Grid.Column>
							<Grid.Column width={8} style={{ padding: 0 }}>
								<RouteMapState height={mainHeight * 0.35} />
							</Grid.Column>
							<Grid.Column width={4}>
								<MalfuncStatistic height={mainHeight * 0.35} />
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={1} style={{ paddingTop: 0 }}>
							<Grid.Column width={16}>
								<CarriageSelector height={mainHeight * 0.2} />
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={4} style={{ paddingTop: 0 }}>
							<Grid.Column
								width={4}
								style={{
									paddingRight: this.state.mainWidth * 0.005,
									paddingLeft: 0,
								}}>
								<FaultStatisticsSummary height={mainHeight * 0.325} />
							</Grid.Column>
							<Grid.Column
								width={4}
								style={{
									paddingRight: this.state.mainWidth * 0.005,
									paddingLeft: this.state.mainWidth * 0.005,
								}}>
								<WarningStatistic height={mainHeight * 0.325} />
							</Grid.Column>
							<Grid.Column
								width={4}
								style={{
									paddingRight: this.state.mainWidth * 0.005,
									paddingLeft: this.state.mainWidth * 0.005,
								}}>
								<WaringProcessingStatu height={mainHeight * 0.325} />
							</Grid.Column>
							<Grid.Column
								width={4}
								style={{
									paddingRight: 0,
									paddingLeft: this.state.mainWidth * 0.005,
								}}>
								<FailureTypeStatistics height={mainHeight * 0.325} />
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Grid.Column>
			</Grid>
		);
	};

	render() {
		if (!this.props.verified) {
			return <Header>404 not found</Header>;
		}
		const selectedTrain = this.props.selectedTrip;
		const { selectedRoute, currentMapInfo } = this.props;
		const canvasStyle = {
			position: "absolute",
			top: 0,
			left: 0,
		};

		const headerHeight = this.state.mainHeight * 0.075;
		return (
			<Grid style={{ backgroundColor: "#4B9FE1" }}>
				<Grid.Row columns={1} style={{ paddingBottom: 0 }}>
					<Grid.Column style={{ paddingRight: 0 }}>
						<Segment
							raised
							style={{ height: headerHeight, backgroundColor: "#150734" }}>
							<canvas
								style={canvasStyle}
								id={this.headerCanvasId}
								width={this.state.canvasWidth}
								height={headerHeight}></canvas>
							{this.renderHeader(currentMapInfo, selectedRoute, selectedTrain)}
						</Segment>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={1} style={{ paddingBottom: 0 }}>
					<Grid.Column>
						<Sidebar.Pushable
							as={Segment}
							style={{ border: "white 0px", backgroundColor: "#4B9FE1" }}>
							{/* {this.renderSidebar()} */}
							<Sidebar.Pusher>{this.renderMainPannel()}</Sidebar.Pusher>
						</Sidebar.Pushable>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

const mapStateToProps = ({
	verified,
	currentMapInfo,
	/* selectedRoute,
	selectedTrip, */
	selectedConverter,
}) => {
	return {
		verified,
		currentMapInfo,
		/* selectedRoute,
		selectedTrip, */
		selectedConverter,
	};
};

export default connect(mapStateToProps, { verifyAuthInfo })(
	TrainPlatform
);
