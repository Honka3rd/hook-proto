import Axios from "axios";
import React from "react";
import { Segment, Image, Card } from "semantic-ui-react";
import { REALTIME_TEST } from "../constants"
import $ from "jquery";

class HookTopo extends React.Component {
	constructor(props) {
		super(props);
		this.axiosInstance = Axios.create({
			baseURL: REALTIME_TEST,
		})
		this.state = {
			flag: false,
		};
	}

	componentDidMount() {
		this.updateData();
	}

	componentDidUpdate(preprops, prestates) {
	}

	updateData = async () => {
		const remainRes = await this.requestRemainData();
		this.processRemainData(remainRes)

		const fatigueRes = await this.requestFatigueData();
		this.processFatigueData(fatigueRes)
	}

	requestRemainData = async () => {
		const params = new FormData();
		params.append("deviceNo", "D00");
		const response = await this.axiosInstance.post("remaining_life", params);
		return this.handleResponse(response);
	};

	requestFatigueData = async () => {
		const params = new FormData();
		params.append("deviceNo", "D00");
		const response = await this.axiosInstance.post("query_fatigue_damage", params);
		return this.handleResponse(response);
	};
	remainDataList = {};
	processRemainData = (data) => {
		this.remainDataList["lifeCoupling"] = data.life_coupling;
		this.remainDataList["lifeMainBumper"] = data.life_main_bumper;
		this.remainDataList["lifeMainRingSpring"] = data.life_main_ring_spring;
		this.remainDataList["lifeMinorBumper"] = data.life_minor_bumper;
		this.remainDataList["lifeMinorRingSpring"] = data.life_minor_ring_spring;
	}

	fatigueDataList = {};
	processFatigueData = (data) => {
		this.fatigueDataList["Dvalue"] = data.D;
		this.fatigueDataList["Divalue"] = data.Di;
		this.fatigueDataList["Lsvalue"] = data.Ls;
		this.fatigueDataList["PointsValue"] = data.points;
		this.setState({
			flag: true,
		});
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

	render() {
		const flag = this.state.flag;
		console.log(flag)
		//console.log(this.state.remainDataFlag)
		const src = '../../../images/couplerState.png';
		return (
			<Segment
				raised
				style={{
					height: this.props.height,
					backgroundColor: "#150734",
				}}>
				{flag ?
					<Card.Group itemsPerRow={2}>
						<Card
							centered
							style={{
								top: "10%",
								backgroundColor: "#4B9FE1",
							}}>
							<Card.Content>
								<Card.Header style={{ fontSize: "150%", color: "aliceblue", fontFamily: "chinese_char_design" }}>剩余寿命</Card.Header>
								<Card.Description style={{ fontSize: "120%", color: "black", fontFamily: "chinese_char_design" }}>
									{/* 从机缓冲器剩余寿命:{this.remainDataList.lifeCoupling} */}
								</Card.Description>
								<Card.Description style={{ fontSize: "120%", color: "black", fontFamily: "chinese_char_design" }}>
									主机缓冲器剩余寿命:{this.remainDataList.lifeMainBumper}
								</Card.Description>
								<Card.Description style={{ fontSize: "120%", color: "black", fontFamily: "chinese_char_design" }}>
									连挂剩余寿命:{this.remainDataList.lifeMainRingSpring}
								</Card.Description>
								<Card.Description style={{ fontSize: "120%", color: "black", fontFamily: "chinese_char_design" }}>
									主机环簧的剩余寿命:{this.remainDataList.lifeMinorBumper}
								</Card.Description>
								<Card.Description style={{ fontSize: "120%", color: "black", fontFamily: "chinese_char_design" }}>
									从机环簧剩余寿命:{this.remainDataList.lifeMinorRingSpring}
								</Card.Description>
							</Card.Content>
						</Card>
						<Card
							centered
							style={{
								top: "10%",
								backgroundColor: "#4B9FE1",
							}}>
							<Card.Content>
								<Card.Header style={{ fontSize: "150%", color: "aliceblue", fontFamily: "chinese_char_design" }}>疲劳损伤</Card.Header>
								<Card.Description style={{ fontSize: "120%", color: "black", fontFamily: "chinese_char_design" }}>
									列车运行时产生的疲劳损伤:{this.fatigueDataList.Dvalue}
								</Card.Description>
								<Card.Description style={{ fontSize: "120%", color: "black", fontFamily: "chinese_char_design" }}>
									应力谱对应的疲劳损伤:{this.fatigueDataList.Divalue}
								</Card.Description>
								<Card.Description style={{ fontSize: "120%", color: "black", fontFamily: "chinese_char_design" }}>
									列车正常行驶里程:{this.fatigueDataList.Lsvalue}
								</Card.Description>
							</Card.Content>
						</Card>
					</Card.Group> : null}
				<Image
					src={src}
					fluid
					style={{
						position: "absolute",
						top: "30%",
						left: "-8%"
					}} />
			</Segment >
		);
	}
}

export default HookTopo;