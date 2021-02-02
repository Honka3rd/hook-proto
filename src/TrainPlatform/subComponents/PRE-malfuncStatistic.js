import React from "react";
import { Segment, Grid, Table, Input, Button, Icon } from "semantic-ui-react";
import $ from "jquery";
import "../../FontEffects/chinese_char_design.css";
import "./animation.css";

class MalfuncStatistic extends React.Component {
	state = {
		mfList: [],
		disableBack: true,
		disableNext: false,
		pageNumber: 1,
		opacity: 1,
	};

	anchor = 0;
	mfData = [];
	totalPage = 0;

	requestMalfuncHistList = () => {
		this.mfData = this.processData();
		this.totalPage = Math.floor(this.mfData.length / 5);
		this.setState({ mfList: this.mfData.slice(this.anchor, this.anchor + 5) });
	};

	processData = () => {
		const fakeData = [];
		for (let i = 0; i < 32; i++) {
			fakeData.push({
				mfCode: i,
				dateTime: new Date().toLocaleDateString(),
				level: 1,
				mfName: "二车一类故障",
			});
		}

		return fakeData;
	};

	componentDidMount() {
		this.requestMalfuncHistList();
	}

	renderMalfuncs = () => {
		return this.state.mfList.map(
			({ mfCode, dateTime, level, mfName }, index) => {
				const rowStyle = {
					height: this.props.height * 0.1,
					animation: `0.8s ease-out 0s 1 ${
						this.state.opacity ? "easeOpacityIn" : "none"
					}`,
					opacity: this.state.opacity,
				};
				return (
					<Table.Row key={index} style={rowStyle}>
						<Table.Cell>{mfCode}</Table.Cell>
						<Table.Cell>{dateTime}</Table.Cell>
						<Table.Cell>{level}</Table.Cell>
						<Table.Cell>{mfName}</Table.Cell>
					</Table.Row>
				);
			}
		);
	};

	fadeInOut = () => {
		this.setState({ opacity: 0 });
		const delay = setTimeout(() => {
			this.setState({ opacity: 1 });
			clearTimeout(delay);
		}, 200);
	};

	onPageNext = () => {
		if (this.anchor + 5 < this.mfData.length) {
			this.anchor = this.anchor + 5;
			const mfList = this.mfData.slice(this.anchor, this.anchor + 5);
			const length = mfList.length;
			if (length < 5) {
				for (let i = 0; i < 5 - length; i++) {
					mfList.push({
						mfCode: "",
						dateTime: "",
						level: "",
						mfName: "",
					});
				}
				this.setState({ disableNext: true });
			} else {
				if (this.state.disableNext) {
					this.setState({ disableNext: false });
				}
			}
			this.setState({
				disableBack: false,
				mfList,
				pageNumber: this.anchor / 5 + 1,
			});
			this.fadeInOut();
		}
	};

	onPageBack = () => {
		if (this.anchor >= 5) {
			this.anchor = this.anchor - 5;
			this.setState({
				mfList: this.mfData.slice(this.anchor, this.anchor + 5),
				disableNext: false,
				pageNumber: this.anchor / 5 + 1,
			});
		}
		if (this.anchor === 0) {
			this.setState({ disableBack: true });
		}
		this.fadeInOut();
	};

	onPageNumberChange = ({ target }) => {
		if (target) {
			const inputVal = parseInt(target.value);
			if (inputVal === this.state.pageNumber) return;
			if (inputVal <= this.totalPage + 1 && inputVal > 0 && !isNaN(inputVal)) {
				const start = inputVal * 5 - 5;
				if (start >= 0 && start <= this.mfData.length) {
					this.anchor = start;
					const mfList = this.mfData.slice(this.anchor, this.anchor + 5);
					const length = mfList.length;
					if (length < 5) {
						for (let i = 0; i < 5 - length; i++) {
							mfList.push({
								mfCode: "",
								dateTime: "",
								level: "",
								mfName: "",
							});
						}
						this.setState({ disableNext: true });
					}

					this.setState({
						mfList,
						pageNumber: inputVal,
					});
					this.setState({ disableBack: start === 0 ? true : false });
					this.fadeInOut();
					if (start + 5 >= this.mfData.length) {
						this.setState({ disableNext: true });
					} else {
						this.setState({ disableNext: false });
					}
				}
			}
		}
	};

	onPageNumClick = ({ target }) => {
		if (target) {
			target.setSelectionRange(0, target.value.length);
		}
	};

	render() {
		return (
			<Segment
				style={{ height: this.props.height, backgroundColor: "#150734" }}>
				<Grid>
					<Grid.Column width={16} style={{ padding: 0 }}>
						<Grid.Row>
							<Segment
								style={{
									height: this.props.height * 0.85,
									padding: 0,
									backgroundColor: "#150734",
								}}>
								<Table
									color={"blue"}
									inverted
									style={{
										height: "inherit",
										fontFamily: "chinese_char_design",
									}}>
									<Table.Header style={{ backgroundColor: "#150734" }}>
										<Table.Row style={{ height: this.props.height * 0.1 }}>
											<Table.HeaderCell>故障代码</Table.HeaderCell>
											<Table.HeaderCell>时间</Table.HeaderCell>
											<Table.HeaderCell>等级</Table.HeaderCell>
											<Table.HeaderCell>故障名称</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>{this.renderMalfuncs()}</Table.Body>
								</Table>
							</Segment>
						</Grid.Row>
						<Grid.Row>
							<Segment
								style={{
									height: this.props.height * 0.15,
									backgroundColor: "#150734",
								}}>
								<Grid>
									<Grid.Row columns={5} style={{ paddingTop: "1.25%" }}>
										<Grid.Column width={1}></Grid.Column>
										<Grid.Column width={5} style={{ padding: 0 }}>
											<Button
												icon
												floated='right'
												color='blue'
												onClick={this.onPageBack}
												disabled={this.state.disableBack}
												style={{
													height: this.props.height * 0.1,
													borderTopRightRadius: 0,
													borderBottomRightRadius: 0,
												}}>
												<Icon name='left chevron' />
											</Button>
										</Grid.Column>
										<Grid.Column width={4} style={{ padding: 0 }}>
											<Input
												placeholder='页数'
												fluid
												style={{ height: this.props.height * 0.1 }}
												value={this.state.pageNumber}
												onChange={this.onPageNumberChange}
												onClick={this.onPageNumClick}
												ref={function (node) {
													if (node && node.inputRef && node.inputRef.current) {
														$(node.inputRef.current).css({
															"border-radius": 0,
															"text-align": "center",
															"font-family": "chinese_char_design",
															"font-weight": "bold",
														});
													}
												}}
											/>
										</Grid.Column>
										<Grid.Column width={5} style={{ padding: 0 }}>
											<Button
												icon
												floated='left'
												color='blue'
												onClick={this.onPageNext}
												disabled={this.state.disableNext}
												style={{
													height: this.props.height * 0.1,
													borderTopLeftRadius: 0,
													borderBottomLeftRadius: 0,
												}}>
												<Icon name='right chevron' />
											</Button>
										</Grid.Column>
										<Grid.Column width={1}></Grid.Column>
									</Grid.Row>
								</Grid>
							</Segment>
						</Grid.Row>
					</Grid.Column>
				</Grid>
			</Segment>
		);
	}
}

export default MalfuncStatistic;
