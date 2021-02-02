import React from "react";
import { Segment, Menu, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import "../../FontEffects/chinese_char_design.css";

class TrainStates extends React.Component {
	state = {
		trains: [],
		focused: null,
		malfuncInfo: [
			{ id: 2, level: "A" },
			{ id: 7, level: "S" },
		],
	};

	requestTrains = (trains) => {
		this.setState({ trains });
	};

	componentDidMount() {
		const converterList = [];
		for (let i = 0; i < 10; i++) {
			converterList.push({ id: i });
		}

		this.requestTrains(converterList);
	}

	onConverterItemClick = (e, { name }) => {
		this.state.trains.forEach(({ id }) => {
			if (id === name) {
				this.setState({ focused: name });
			}
		});
	};

	renderMenuItems = () => {
		return this.state.trains.map((converter) => {
			const name = converter.id;
			let content = `SH6 --- ${converter.id}`;
			let color = "aliceblue";
			this.state.malfuncInfo.forEach(({ id, level }) => {
				if (name === id) {
					if (level === "A") {
						content = (
							<p>
								<span>{content}: </span>
								<span style={{ float: "right" }}>一般故障</span>
							</p>
						);
						color = "#EBA63F";
					}

					if (level === "S") {
						content = (
							<p>
								<span>{content}: </span>
								<span style={{ float: "right" }}>严重故障</span>
							</p>
						);
						color = "#E12B38";
					}
				}
			});

			return (
				<Menu.Item
					key={converter.id}
					content={content}
					name={`${name}`}
					active={this.state.focused === name}
					onClick={this.onConverterItemClick}
					style={{
						width: "100%",
						fontFamily: "chinese_char_design",
						fontWeight: "bold",
						color,
					}}
				/>
			);
		});
	};

	render() {
		return (
			<Segment
				raised
				style={{
					height: this.props.height,
					overflow: "auto",
					backgroundColor: "#150734",
					display: "flex",
					flexDirection: "column",
				}}>
				<Header
					style={{ fontFamily: "chinese_char_design", color: "aliceblue" }}>
					列车状态
				</Header>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
                        overflow: "auto",
					}}>
					<Menu
						vertical
						inverted
						color='blue'
						style={{
							width: "100%",
							overflow: "auto",
                            display: "inline-block",
                            
						}}>
						{this.renderMenuItems()}
					</Menu>
				</div>
			</Segment>
		);
	}
}

export default connect()(TrainStates);
