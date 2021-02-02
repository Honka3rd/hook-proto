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

class FaultStatisticsSummary extends React.Component {
	faultStatisticsSummaryId = "fault_statistics_summaryId";
	faultStatisticsSummaryEcharts = null;
	constructor(props) {
		super(props);
		this.state = {
			mainHight: window.innerHeight,
			mainWidth: window.innerWidth,
			checked: false,
		};
	}

	componentDidMount() {
		const faultStatisticsSummaryComponent = document.getElementById(
			this.faultStatisticsSummaryId
		);
		this.faultStatisticsSummaryEcharts = Echart.init(
			faultStatisticsSummaryComponent
		);
		this.faultStatisticsSummaryEcharts.setOption(
			this.faultStatisticsSummaryOption
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
			this.faultStatisticsSummaryEcharts.resize();
		}
	}

	onCheckedChange = () => {
		this.setState({
			checked: !this.state.checked,
		});
	};

	faultStatisticsSummaryOption = {
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
				label: {
					backgroundColor: "#6a7985",
				},
			},
		},
		// tooltip: {
		// 	trigger: "axis",
		// },
		legend: {
			data: ["一级故障", "二级故障", "三级故障"],
			left: this.props.height * 0.25,
			textStyle: {
				color: "#7ED5EA",
				fontFamily: "chinese_char_design",
			},
			icon: "roundRect",
		},
		grid: {
			left: "1%",
			right: "15%",
			bottom: "0%",
			top: "7%",
			containLabel: true,
		},
		toolbox: {
			orient: "vertical",
			itemGap: 20,
			feature: {
				saveAsImage: {},
				dataZoom: {},
				dataView: {},
			},
			// iconStyle:{
			//     color:'white',
			// },
			emphasis: {
				iconStyle: {
					textPosition: "bottom",
				},
			},
		},
		xAxis: {
			type: "category",
			name: "时间",
			boundaryGap: false,
			data: [
				"9.16",
				"9.17",
				"9.18",
				"9.19",
				"9.20",
				"9.21",
				"9.22",
				"9.23",
				"9.24",
				"9.25",
			],
			nameTextStyle: {
				fontFamily: "chinese_char_design",
			},
			axisLine: {
				lineStyle: {
					color: "#7ED5EA",
				},
			},
			axisLabel: {
				rotate: -30,
				interval: 0,
			},
		},
		yAxis: {
			type: "value",
			nameTextStyle: {
				fontFamily: "chinese_char_design",
			},
			//max: 0,
			//min: 0,
			axisLine: {
				lineStyle: {
					color: "#7ED5EA",
				},
			},
			splitLine: {
				show: false,
				lineStyle: {
					color: "#7ED5EA",
					opacity: 0.3,
				},
			},
		},
		series: [
			{
				name: "一级故障",
				type: "line",
				//stack: "总量",
				data: [40.2, 52.8, 25.2, 33.5, 25.5, 23.4, 40.1, 42.8, 14.2, 42.5],
			},
			{
				name: "二级故障",
				type: "line",
				//stack: "总量",
				data: [50.4, 54.2, 60.5, 42.5, 52.2, 42.1, 44.4, 65.2, 56.2, 45.0],
			},
			{
				name: "三级故障",
				type: "line",
				//stack: "总量",
				data: [75.5, 45.2, 85.2, 56.2, 54.2, 54.2, 45.2, 78.2, 45.3, 89.2],
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
					故障统计汇总
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
							id={this.faultStatisticsSummaryId}
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

export default FaultStatisticsSummary;
