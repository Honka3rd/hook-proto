import React from "react";
import { connect } from "react-redux";
import { Segment, Input, Button, Grid, Dropdown } from "semantic-ui-react";

class HistoryDateChoose extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: null,
			startTime: null,
			endDate: null,
			endTime: null,
			timeGranuleValue: null,
			tipsValue: null,
			disabled: true,
			granule: [
				{ key: "MAX_VALUE", text: "最大数值抽样", value: "MAX_VALUE" },
				{ key: "MIN_VALUE", text: "最小数值抽样", value: "MIN_VALUE" },
				{ key: "AVG", text: "平均数值抽样", value: "AVG" },
			],
			tips: [],
		};
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
			this.setState({
				tips: [
					{ key: 'channel1', text: 'GHChannel1', value: 'GHChannel1' },
					{ key: 'channel2', text: 'GHChannel2', value: 'GHChannel2' },
					{ key: 'channel3', text: 'GHChannel3', value: 'GHChannel3' },
					{ key: 'channel4', text: 'GHChannel4', value: 'GHChannel4' },
					{ key: 'channel5', text: 'GHChannel5', value: 'GHChannel5' },
					{ key: 'channel6', text: 'GHChannel6', value: 'GHChannel6' },
					{ key: 'channel7', text: 'GHChannel7', value: 'GHChannel7' },
					{ key: 'channel8', text: 'GHChannel8', value: 'GHChannel8' },
					{ key: 'channel9', text: 'GHChannel9', value: 'GHChannel9' },
				],
			});
		} else {
			this.setState({
				tips: [
					{ key: "channel10", text: "GHChannel10", value: "GHChannel10" },
					{ key: "channel11", text: "GHChannel11", value: "GHChannel11" },
					{ key: "channel12", text: "GHChannel12", value: "GHChannel12" },
					{ key: "channel13", text: "GHChannel13", value: "GHChannel13" },
					{ key: "channel14", text: "GHChannel14", value: "GHChannel14" },
				],
			});
		}
	}

	componentDidUpdate(preProps, preState) {
		//判断父组件isButtonDone状态 打开确定按钮
		if ((preProps.isButtonDone !== this.props.isButtonDone) && (this.props.isButtonDone === false)) {
			this.setState({
				disabled: false
			})
		}
		//取值并把时间转换成时间戳
		let timeGranule, tips, startDate, startTime, endDate, endTime, startTimeStamp, endTimeStamp = null;

		timeGranule = this.state.timeGranuleValue;
		tips = this.state.tipsValue;

		startDate = this.state.startDate;
		startTime = this.state.startTime;
		if (startDate && startTime) {
			startTimeStamp = Date.parse(startDate.concat(" ").concat(startTime));
		}
		endDate = this.state.endDate;
		endTime = this.state.endTime;

		if (endDate && endTime) {
			endTimeStamp = Date.parse(endDate.concat(" ").concat(endTime));
		}

		if (timeGranule && tips && startTimeStamp && endTimeStamp) {
			if (tips.length !== 0) {
				if (endTimeStamp - startTimeStamp > 86400000) {
					if (preState.disabled === false) {
						this.setState({
							disabled: true
						})
					}
				} else if (endTimeStamp - startTimeStamp < 0) {
				} else {
					if (this.preState.disabled === true) {
						this.setState({
							disabled: false
						})
					}
				}
			} else {
				if (this.preState.disabled === false) {
					this.setState({
						disabled: true
					})
				}
			}
		} else {
			if (this.preState.disabled === false) {
				this.setState({
					disabled: true
				})
			}
		}
	};

	handletimeGranuleChange = (e, { value }) => {
		this.setState({
			timeGranuleValue: value,
		});
	};

	handleTipsChange = (e, { value }) => {
		this.setState({
			tipsValue: value,
		});
	};

	handleStartDate = (e, { value }) => {
		this.setState({
			startDate: value,
		});
	};

	handleStartTime = (e, { value }) => {
		this.setState({
			startTime: value,
		});
	};

	handleEndDate = (e, { value }) => {
		this.setState({
			endDate: value,
		});
	};

	handleEndTime = (e, { value }) => {
		this.setState({
			endTime: value,
		});
	};

	buttonOnClick = () => {
		let startTimeStamp,
			endTimeStamp = null;

		startTimeStamp = Date.parse(
			this.state.startDate.concat(" ").concat(this.state.startTime)
		);

		endTimeStamp = Date.parse(
			this.state.endDate.concat(" ").concat(this.state.endTime)
		);

		this.props.changeTimeGranule(this.state.timeGranuleValue);
		this.props.changeTips(this.state.tipsValue);
		this.handleStartTimeChange(startTimeStamp);
		this.handleEndTimeChange(endTimeStamp);
		//this.props.changeChecked();
		this.setState({
			disabled: !this.state.disabled
		})
	};

	handleStartTimeChange = (e) => {
		const value = e;
		this.props.changeStartTime(value);
	};

	handleEndTimeChange = (e) => {
		const value = e;
		this.props.changeEndTime(value);
	};

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
				<Grid style={{ margin: 0 }}>
					<Grid.Row style={{ paddingBottom: 0 }}>
						<Grid.Column width='4'>
							<Dropdown
								id='timeGranule'
								fluid
								placeholder='数据抽样方式'
								options={this.state.granule}
								selection
								upward={false}
								onChange={this.handletimeGranuleChange}
							/>
						</Grid.Column>
						<Grid.Column width='12'>
							<Dropdown
								id='tipsForChannel'
								fluid
								placeholder='选择标签'
								options={this.state.tips}
								selection
								multiple
								upward={false}
								onChange={this.handleTipsChange}
							/>
						</Grid.Column>
					</Grid.Row>

					<Grid.Row style={{ paddingBottom: 0 }}>
						<Grid.Column width='4'>
							<Input
								fluid
								type='date'
								placeholder='起始日期'
								onChange={this.handleStartDate}
								id='startDate'
								labelPosition='left'
								label={{ content: "开始日期" }}
							/>
						</Grid.Column>
						<Grid.Column width='4'>
							<Input
								fluid
								type='time'
								placeholder='起始时间'
								onChange={this.handleStartTime}
								id='startTime'
								labelPosition='left'
								label={{ content: "开始时间" }}
							/>
						</Grid.Column>
						<Grid.Column width='4'>
							<Input
								fluid
								type='date'
								placeholder='结束日期'
								onChange={this.handleEndDate}
								id='endDate'
								labelPosition='left'
								label={{ content: "结束日期" }}
							/>
						</Grid.Column>
						<Grid.Column width='4'>
							<Input
								fluid
								type='time'
								placeholder='结束时间'
								onChange={this.handleEndTime}
								id='endTime'
								labelPosition='left'
								label={{ content: "结束时间" }}
							/>
						</Grid.Column>
					</Grid.Row>
					<Button
						fluid
						id='buttonID'
						onClick={this.buttonOnClick}
						disabled={this.state.disabled}
						style={{
							fontSize: "85%",
							fontFamily: "chinese_char_design",
							marginTop: this.props.height * 0.02,
						}}>
						确认
					</Button>
				</Grid>
			</Segment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		timeGranule: state.timeGranule,
	};
};

export default connect(mapStateToProps)(HistoryDateChoose);
