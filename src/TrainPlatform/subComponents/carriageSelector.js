import React from "react";
import {
	Grid,
	Segment,
	Button,
	Icon,
	Modal,
	Header,
	Transition,
} from "semantic-ui-react";
import { connect } from "react-redux";
import Carriages from "./carriages";
import { selectHook } from "../actions";
import "../../FontEffects/chinese_char_design.css";
import { routes } from "../../constants";

class CarriageSelector extends React.Component {
	hookBufferSkeleton = [1, 2, 3, 4, 5, 6];

	state = {
		alertOpen: false,
		transitionVisable: false,
		transitionWrapperVisable: false,
	};

	componentDidMount() {
		this.children = [];

		window.onbeforeunload = () => {
			if (
				window.location.hash === `#${routes.train_part_select}` &&
				this.children.length &&
				this.children.some(({ tab }) => {
					return tab.closed === false;
				})
			) {
				setTimeout(() => {
					this.openAlert();
				}, 500);

				return "";
			}
		};

		window.onunload = () => {
			if (this.children.length) {
				this.children.forEach(({ tab }) => {
					tab && !tab.closed && tab.close();
				});
			}
		};
	}

	renderHookBuffers = () => {
		const hookStyle = {
			fontFamily: "chinese_char_design",
			fontWeight: "bold",
		};
		return this.hookBufferSkeleton.map((hook) => {
			return (
				<Grid.Column width={2} key={hook}>
					<Button
						style={hookStyle}
						inverted
						color='blue'
						fluid
						onClick={() => {
							this.onSelectHook(hook);
						}}>
						<Icon name='linkify' />
						车钩--{hook}
					</Button>
				</Grid.Column>
			);
		});
	};

	onSelectHook = (hookID) => {
		const win = this.children.find(({ id }) => {
			return id === hookID;
		});

		if (win) {
			if (win.tab) {
				if (win.tab.closed) {
					this.children.splice(this.children.indexOf(win), 1);
					this.openSubWindow(hookID);
				} else {
					win.tab.focus && win.tab.focus();
				}
			}
		} else {
			this.openSubWindow(hookID);
		}
	};

	openSubWindow = (hookID) => {
		const equipWin = window.open(
			window.location.origin + `#${routes.hook_detail}`,
			"_blank"
		);
		equipWin.localStorage.setItem("hook", `${hookID}`);
		this.props.selectHook(hookID);
		this.children.push({ tab: equipWin, id: hookID });
	};

	openAlert = () => {
		this.setState({ transitionWrapperVisable: true, alertOpen: true });
	};

	closeAlert = () => {
		this.setState({ alertOpen: false });
	};

	startAnimation = () => {
		this.setState({ transitionVisable: true });
	};

	endAnimation = () => {
		this.setState({
			transitionVisable: false,
			transitionWrapperVisable: false,
		});
		setTimeout(this.closeAlert, this.animationDuration);
	};

	animationDuration = 500;

	render() {
		const { transitionVisable, transitionWrapperVisable } = this.state;
		return (
			<React.Fragment>
				<Segment
					raised
					style={{
						height: this.props.height,
						backgroundColor: "#150734",
						padding: 0,
					}}>
					<Carriages
						height={this.props.height * 0.6}
						top='0'
						faultCarriages={[]}
						backgroundColor='#150734'
						zIndex={10}
					/>
					<Grid columns={3}>
						<Grid.Column width={3}></Grid.Column>
						<Grid.Column width={12}>
							<Segment
								style={{
									height: this.props.height * 0.2,
									padding: 0,
									backgroundColor: "#150734",
								}}>
								<Grid>
									<Grid.Row style={{ padding: 0, top: "2vh" }}>
										{this.renderHookBuffers()}
									</Grid.Row>
								</Grid>
							</Segment>
						</Grid.Column>
						<Grid.Column width={1}></Grid.Column>
					</Grid>
				</Segment>
				<Transition
					visible={transitionWrapperVisable}
					animation='scale'
					duration={this.animationDuration}
					unmountOnHide={false}>
					<Modal
						open={this.state.alertOpen}
						onOpen={this.openAlert}
						onMount={this.startAnimation}
						onClose={this.endAnimation}>
						<Transition
							visible={transitionVisable}
							animation='scale'
							duration={this.animationDuration}
							unmountOnHide={false}>
							<Header icon='warning sign' content='提示' />
						</Transition>
						<Modal.Content>
							<Transition
								visible={transitionVisable}
								animation='scale'
								duration={this.animationDuration}
								unmountOnHide={false}>
								<p>刷新或关闭主页面会关闭掉所有子页面</p>
							</Transition>
						</Modal.Content>
						<Modal.Actions>
							<Transition
								visible={transitionVisable}
								animation='scale'
								duration={this.animationDuration}
								unmountOnHide={false}>
								<Button color='blue' onClick={this.endAnimation}>
									<Icon name='close' /> 关闭
								</Button>
							</Transition>
						</Modal.Actions>
					</Modal>
				</Transition>
			</React.Fragment>
		);
	}
}

export default connect(null, { selectHook })(CarriageSelector);
