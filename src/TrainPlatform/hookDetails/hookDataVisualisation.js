import React from "react";
import { Segment } from "semantic-ui-react";
import { merge, uniqBy } from "lodash";
import { connect } from "react-redux";
import DataFlow from "../../lib/timeFlowSequenceComponent/d3SequenceDataFlow";
import "../../FontEffects/chinese_char_design.css";
import { WS_BASIC_ADDRESS, WS_PORT } from "../constants";
import { fillAryWithMemo } from "../../lib/algorithms/MapRestArrayByArray";
const DATA_PATCH_PER_SCREEN = 500;

class HookData extends React.Component {
	constructor(props) {
		super(props);
		this.uuid = new Date().getTime().toString();
		this.clientSocket = null;
		this.hookID = undefined;
		this.dataAcceptanceTimeout = 1000; //前端更新频率
		this.attrNames = [];

		let configPairs = {
			disableColor: "white",
			labelCircleR: 6,
			labelBaseHeight: !isNaN(this.props.height) ? this.props.height * 0.2 : 0,
		};

		this.state = {
			processedData: null,
			configPairs,
			width: 0,
			height: 0,
		};

		this.currTime = 0;
	}

	componentDidMount() {
		let hookID;
		try {
			hookID = window.localStorage.getItem("hook");
			if (!hookID) {
				window.alert("车钩信息丢失，请重新进入页面");
				window.close();
			}
			this.hookID = hookID;
		} catch (error) {
			window.location.reload();
		}
		hookID = +hookID;
		if (hookID === 1 || hookID === 6) {
			this.attrNames = [
				{ key: "GHChannel1", color: "red" },
				{ key: "GHChannel2", color: "green" },
				{ key: "GHChannel3", color: "blue" },
				{ key: "GHChannel4", color: "yellow" },
				{ key: "GHChannel5", color: "orange" },
				{ key: "GHChannel6", color: "olive" },
				{ key: "GHChannel7", color: "pink" },
				{ key: "GHChannel8", color: "teal" },
				{ key: "GHChannel9", color: "violet" },
			];
		} else {
			this.attrNames = [
				{ key: "GHChannel10", color: "purple" },
				{ key: "GHChannel11", color: "pink" },
				{ key: "GHChannel12", color: "brown" },
				{ key: "GHChannel13", color: "grey" },
				{ key: "GHChannel14", color: "Cyan" },
			];
		}

		let configPairs = {
			disableColor: "white",
			labelCircleR: 6,
			labelBaseHeight: !isNaN(this.props.height) ? this.props.height * 0.2 : 0,
		};

		this.attrNames.forEach(({ key, color }) => {
			if (key === "GHChannel5" || key === "GHChannel12") {
				configPairs[key] = {
					color,
					text: key,
					lineType: "default",
					disableLine: true,
					style: { fontSize: "70%", fontFamily: "chinese_char_design" },
				};
			} else {
				configPairs[key] = {
					color,
					text: key,
					lineType: "default",
					disableScatter: true,
					style: { fontSize: "70%", fontFamily: "chinese_char_design" },
				};
			}
		});

		this.setState({
			configPairs: configPairs,
		});

		document.title = `钩缓部件--${hookID}--详情`;

		const wsData = JSON.stringify({
			msg_type: 1024,
			route_no: "C053201",
			trip_no: "T01",
			set_meal: `set_meal_gh_${hookID}`,
			carriage_no: "D00",
			uuid: this.uuid,
		});
		if (
			!(this.clientSocket instanceof WebSocket) ||
			(this.clientSocket instanceof WebSocket &&
				this.clientSocket.readyState !== 1)
		) {
			this.resolveSocketClient()
				.then(({ clientSocket }) => {
					clientSocket.send(wsData);
				})
				.catch((error) => {
					this.handleBadData(error);
				});
		} else {
			this.clientSocket.send(wsData);
		}
	}

	componentDidUpdate(preProps) {
		const { height } = this.props;
		if (preProps.height !== height && !isNaN(height)) {
			this.setState(({ configPairs }) => {
				const config = Object.assign({}, configPairs);
				config.labelBaseHeight = !isNaN(height) ? height * 0.2 : 0;
				return { configPairs: config };
			});
		}
	}

	resolveSocketClient = () => {
		return new Promise((resolve, reject) => {
			// 构造一个基础socket对象，至少需要传入一个URL
			const clientSocket = new WebSocket(
				`ws://${WS_BASIC_ADDRESS}:${WS_PORT}/webSocket/${this.uuid}`
			);

			// 绑定socket生命周期函数
			clientSocket.onopen = (event) => {
				console.log("connection has been established");
				this.clientSocket = clientSocket;
				this.clientSocket.onmessage = (event) => this.onMessageHandler(event);
				this.clientSocket.onclose = (event) => this.onCloseHandler(event);

				resolve({ clientSocket: this.clientSocket, event });
			};

			clientSocket.onerror = (error) => {
				reject(error);
			};
		});
	};

	// 当服务器传来消息时
	onMessageHandler = (event) => {
		console.log("a message sent by a server");
		if (event && event.data) {
			try {
				if ("requestIdleCallback" in window) {
					window.requestIdleCallback((deadline) => {
						if (deadline.timeRemaining() > 1) {
							this.enqueueDataToState(this.processData(JSON.parse(event.data)));
						}
					});
				} else {
					this.enqueueDataToState(this.processData(JSON.parse(event.data)));
				}
			} catch (error) {
				this.handleBadData(error);
			}
		}
	};

	handleBadData = (error) => {
		console.log("服务器端JSON格式错误", error);
		this.clientSocket instanceof WebSocket &&
			this.clientSocket.readyState === 1 &&
			this.clientSocket.send("JSON 格式错误: " + error);
	};

	// 当socket被cs任意一方关闭时
	onCloseHandler = (event) => {
		console.log("socket is closing", event);
	};

	componentWillUnmount() {
		// 当组件卸载时，主动关闭socket
		this.clientSocket instanceof WebSocket &&
			this.clientSocket.readyState === 1 &&
			this.clientSocket.send(
				JSON.stringify({
					msg_type: 1025,
					route_no: "C053201",
					trip_no: "T01",
					set_meal: `set_meal_gh_${this.hookID}`,
					carriage_no: "D00",
					uuid: this.uuid,
				})
			);
	}

	// componentWillUnmount() {
	// 	// 当组件卸载时，主动关闭socket
	// 	this.clientSocket instanceof WebSocket &&
	// 		this.clientSocket.readyState === 1 &&
	// 		this.clientSocket.send(
	// 			JSON.stringify({
	// 				msg_type: 1025,
	// 				route_no: "Q053201",
	// 				trip_no: "T01",
	// 				set_meal: `set_meal_gh_${this.hookID}`,
	// 				carriage_no: "D00",
	// 				uuid: this.uuid,
	// 			})
	// 		);
	// }

	processData = (data) => {
		console.log(data)
		let processed = null;
		if (data instanceof Array && data.length) {
			processed = [];
			data.forEach((d) => {
				if (d && d.tsPairs instanceof Array && d.varName) {
					d.tsPairs.forEach((element) => {
						let datum = {};
						datum.date = element.key;
						const parsedVal = parseFloat(element.value);
						datum[d.varName] = !isNaN(parsedVal) ? parsedVal : 0;
						processed.push(datum);
					});
				}
			});
		}
		console.log(processed);
		const resultList = [];
		if (processed instanceof Array && processed.length) {
			let copy = [...processed];
			processed.forEach((element) => {
				let o = { ...element };
				copy.forEach((innerElem) => {
					if (element.date === innerElem.date) {
						o = merge(o, innerElem);
					}
				});
				resultList.push(o);
			});
		}
		console.log(resultList);
		return uniqBy(
			fillAryWithMemo(
				[...this.attrNames.map(({ key }) => key), "date"],
				resultList,
				["date"]
			),

			"date"
		);
	};

	enqueuedArrayLength = 0;
	arrayContainer = [];

	enqueueDataToState = (processed) => {
		console.log(processed);
		if (processed instanceof Array) {
			let spreaded = [];
			if (this.enqueuedArrayLength < DATA_PATCH_PER_SCREEN) {
				this.arrayContainer.push(processed);
				for (let ary of this.arrayContainer) {
					spreaded = [...spreaded, ...ary];
				}
				this.enqueuedArrayLength++;
			} else {
				this.arrayContainer.shift();
				this.arrayContainer.push(processed);
				for (let ary of this.arrayContainer) {
					spreaded = [...spreaded, ...ary];
				}
			}
			this.setState(() => {
				return {
					processedData: uniqBy(spreaded, "date"),
				};
			});
			//console.log(this.state.processedData);
		} else {
			this.setState({ processData: null });
		}
	};

	render() {
		const { processedData, configPairs } = this.state;
		const { width, height } = this.props;
		return (
			<Segment style={{ padding: 0, backgroundColor: "#150734" }}>
				<DataFlow
					data={processedData}
					width={width}
					height={height}
					configPairs={configPairs}
					displayOption={{
						line: {
							display: true,
							antiAliasing: 3,
							lineWidth: 1,
						},
						scatter: {
							//display: false,
							r: 2,
						},
					}}
					title={{
						text: "实时数据",
						align: "left",
						stroke: "",
						fill: "#85FFFF",
						deltaX: 20,
						deltaY: 20,
						style: {
							fontSize: "120%",
							fontWeight: "bold",
							fontFamily: "chinese_char_design",
						},
					}}
					duration={this.dataAcceptanceTimeout}
					axisColor='aliceblue'
					xTicks={20}
					yTicks={10}
					rotateX={20}
					backgroundColor={"#150734"}
					labelTextFill={"aliceblue"}
					dateStrFormatter={"%H:%M:%S.%L"}
					toolTips={{
						lineWidth: 1,
						color: "white",
						stroke: "aliceblue",
						strokeWidth: "2",
						fontSize: "smaller",
						type: "default",
						timePrecision: "m s ms",
						style: {
							opacity: 0.5,
						},
						accuracy: { fix: 0, type: "round" },
					}}
					maxDatalength={10000}
					processTimeRemaining={1}
					debounceTime={this.dataAcceptanceTimeout}
				/>
			</Segment>
		);
	}
}

const mapStateToProps = ({ verified }) => {
	return {
		verified,
	};
};

export default connect(mapStateToProps)(HookData);
