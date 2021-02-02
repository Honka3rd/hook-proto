import React from "react";
import $ from "jquery";
import { connect } from "react-redux";
import { routes, VERIFY_LOGIN_INFO } from "../constants";
import { Grid, Header, Form, Segment, Button, Ref } from "semantic-ui-react";
import "../FontEffects/chinese_char_design.css";

export const verifyAuthInfo = (verified = false) => {
	return {
		type: VERIFY_LOGIN_INFO,
		payload: verified,
	};
};

export const verified = (state = false, action) => {
	if (action.type === VERIFY_LOGIN_INFO) {
		return action.payload;
	}

	return state;
};

class Authentication extends React.Component {
	state = {
		uname: "",
		pwd: "",
	};

	tryLogin = () => {
		$.ajax({
			url: "./auth.json",
			success: (uinfo) => {
				//const { uname, pwd } = this.state;
				if (true
					// uname === uinfo.uname &&
					// new Sha.sha256().update(pwd).digest("hex") === uinfo.password
				) {
					this.props.verifyAuthInfo(true);
					setTimeout(() => {
						this.props.history.push(routes.train_part_select);
					});
				}
			},
		});
	};

	onUsernameChange = (e) => {
		this.setState({ uname: e.target.value });
	};

	onPasswordChange = (e) => {
		this.setState({ pwd: e.target.value });
	};

	render() {
		return (
			<Grid
				textAlign='center'
				style={{ height: "100vh" }}
				verticalAlign='middle'>
				<Grid.Column style={{ maxWidth: window.innerWidth / 4 }}>
					<Header
						as='h2'
						color='blue'
						textAlign='center'
						style={{ fontFamily: "chinese_char_design" }}>
						钩缓数据监控系统
					</Header>
					<Form size='large'>
						<Ref
							innerRef={function (node) {
								if (node) {
									const children = $(node).children();
									const uname = children.get(0);
									const pwd = children.get(1);
									[uname, pwd].forEach(function (dom) {
										$(dom).children().first().children().first().css({
											fontFamily: "chinese_char_design",
											fontWeight: "bolder",
										});
									});
								}
							}}>
							<Segment stacked>
								<Form.Input
									fluid
									icon='user'
									iconPosition='left'
									placeholder='输入账号'
									value={this.state.uname}
									onChange={this.onUsernameChange}
								/>
								<Form.Input
									fluid
									icon='lock'
									iconPosition='left'
									placeholder='输入密码'
									type={this.state.pwd.length ? "password" : "text"}
									value={this.state.pwd}
									onChange={this.onPasswordChange}
									autoComplete='off'
								/>
								<Button
									color='blue'
									fluid
									size='large'
									onClick={this.tryLogin}
									style={{ fontFamily: "chinese_char_design" }}>
									登录
								</Button>
							</Segment>
						</Ref>
					</Form>
				</Grid.Column>
			</Grid>
		);
	}
}

export default connect(null, { verifyAuthInfo })(Authentication);
