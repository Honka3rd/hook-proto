import React from "react";
import $ from "jquery";
import { ResizeSensor } from "css-element-queries";
import Echart from "echarts";
import { Segment, Popup, Checkbox, Sidebar, Input } from "semantic-ui-react";

class HistoryDateChoose extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			startTime: null,
			endTime: null,
		};
	}

	onChange = () => {};

	render() {
		return (
			<Segment
				raised
				style={{
					padding: this.props.height * 0.03,
					height: this.props.height * 0.9,
					backgroundColor: "RGBA(55,120,194,0.5)",
					border: 0,
				}}>
				<div
					style={{
						fontFamily: "chinese_char_design",
						color: "#FFFFFF",
						textAlign: "center",
						fontSize: "80%",
						margin: 0,
					}}>
					起始时间
				</div>
				<Input
					fluid
					type='date'
					placeholder='起始日期'
					style={{
						fontSize: "80%",
						fontFamily: "chinese_char_design",
						marginTop: this.props.height * 0.01,
					}}
				/>
				<Input
					fluid
					// value={this.state.startTime}
					type='time'
					step='01'
					onChange={this.onChange}
					//error={this.state.startTimeError}
					placeholder='起始时间'
					style={{
						fontSize: "85%",
						fontFamily: "chinese_char_design",
						marginTop: this.props.height * 0.01,
					}}
					labelPosition='right'
				/>
				<div
					style={{
						fontFamily: "chinese_char_design",
						color: "#FFFFFF",
						textAlign: "center",
						fontSize: "80%",
						marginTop: this.props.height * 0.02,
					}}>
					终止时间
				</div>
				<Input
					fluid
					type='date'
					placeholder='终止日期'
					style={{
						fontSize: "80%",
						fontFamily: "chinese_char_design",
						marginTop: this.props.height * 0.01,
					}}
				/>
				<Input
					fluid
					type='time'
					step='01'
					onChange={this.onChange}
					//error={this.state.endTimeError}
					placeholder='终止时间'
					style={{
						fontSize: "85%",
						fontFamily: "chinese_char_design",
						marginTop: this.props.height * 0.01,
					}}
					labelPosition='right'
				/>
			</Segment>
		);
	}
}

class FailureTypeStatistics extends React.Component {
	failureTypeStatisticsId = "failure_type_statistics";
	failureTypeStatisticsEcharts = null;
	constructor(props) {
		super(props);
		this.state = {
			mainHight: window.innerHeight,
			mainWidth: window.innerWidth,
			checked: false,
		};
	}

	componentDidMount() {
		const failureTypeStatisticsComponent = document.getElementById(
			this.failureTypeStatisticsId
		);
		this.failureTypeStatisticsEcharts = Echart.init(
			failureTypeStatisticsComponent
		);
		this.failureTypeStatisticsEcharts.setOption(
			this.failureTypeStatisticsOption
		);

		this.setState({
			mainHight: window.innerHeight,
			mainWidth: window.innerWidth,
		});

		new ResizeSensor($("body"), () => {
			this.setState({
				mainHight: window.innerHeight,
				mainWidth: window.innerWidth,
			});
		});
	}

	componentDidUpdate(preprops, prestates) {
		if (
			prestates.mainHight !== this.state.mainHight ||
			prestates.mainWidth !== this.state.mainWidth
		) {
			this.failureTypeStatisticsEcharts.resize();
		}
	}

	onCheckedChange = () => {
		this.setState({
			checked: !this.state.checked,
		});
	};

	failureTypeStatisticsOption = {
		//color:['#BA332D','#69A0A9'],
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b}: {c} ({d}%)",
		},
		legend: {
			orient: "vertical",
			left: 1,
			data: ["温度过高23", "湿度过大21", "力过大25", "方向转角过大27"],
			textStyle: {
				color: "white",
				fontFamily: "chinese_char_design",
			},
		},

		series: [
			{
				name: "告警类型",
				type: "pie",
				radius: ["60%", "90%"],
				avoidLabelOverlap: false,
				center: ["60%", "50%"],
				label: {
					formatter: "故障总数:96",
					fontFamily: "chinese_char_design",
					show: true,
					position: "center",

					textStyle: {
						fontWeight: "normal",
						fontSize: 14,
						color: "white",
					},
				},
				// emphasis: {
				// 	label: {
				// 		formatter:'{b}: {c} ({d}%)',
				// 		show: true,
				// 		fontSize: '12',
				// 		fontWeight: 'bold'
				// 	}
				// },
				labelLine: {
					show: false,
				},
				data: [
					{ value: 23, name: "温度过高23" },
					{ value: 21, name: "湿度过大21" },
					{ value: 25, name: "力过大25" },
					{ value: 27, name: "方向转角过大27" },
				],
			},
		],
	};

	render() {
		return (
			<Segment
				raised
				style={{
					padding: this.state.mainWidth * 0.005,
					paddingLeft: this.state.mainWidth * 0.015,
					height: this.props.height,
					backgroundColor: "#150734",
				}}>
				{/* <Segment basic
					style={{position:'absolute',
							top:this.props.height*0.37,
							left:this.state.mainWidth*0.088,
							color:'#fff',

			}}>告警总数
				</Segment> */}
				<Popup
					content='选择时间'
					inverted
					trigger={
						<Checkbox
							toggle
							checked={this.state.checked}
							onChange={this.onCheckedChange}
						/>
					}
				/>
				<div
					style={{
						color: "#7ED5EA",
						fontFamily: "chinese_char_design",
						fontSize: "120%",
						width: this.state.mainWidth * 0.1,
						position: "absolute",
						left: this.state.mainWidth * 0.06,
						top: this.state.mainHight * 0.01,
					}}>
					故障类型统计
				</div>
				<Sidebar.Pushable as={"div"}>
					<Sidebar
						as={"div"}
						animation='overlay'
						icon='labeled'
						//inverted
						vertical='true'
						visible={this.state.checked}
						width='thin'
						style={{ boxShadow: "none", border: 0 }}>
						<HistoryDateChoose height={this.props.height}></HistoryDateChoose>
					</Sidebar>
					<Sidebar.Pusher>
						<Segment
							basic
							id={this.failureTypeStatisticsId}
							style={{
								width: this.state.mainWidth * 0.23,
								height: this.state.mainHight * 0.25,
								padding: 0,
								//top: this.props.height * 0.04,
								//left: this.state.mainwidth * 0.01,
								position: "absolute",
								border: 0,
								// backgroundColor: "#0F2557",
								//visibility: "hidden",
							}}></Segment>
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</Segment>
		);
	}
}

export default FailureTypeStatistics;
