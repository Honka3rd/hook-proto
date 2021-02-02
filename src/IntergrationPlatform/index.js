import React from "react";
import history from "../history";
import { routes } from "../constants";
import { Segment, Grid, Header, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import AMapContainer from "../map/AMapContainer";
import MapHeader from "../MapHeader";
import { connect } from "react-redux";

class IPlatform extends React.Component {
	trainPartsObv = () => {
		history.push(routes.train_part_select);
	};

	outSystem = () => {
		history.push(routes.login_verify);
	};

	render() {
        /* if(!this.props.verified) {
            return <Header>404 not found</Header>
        } */
		const mainHeight = window.innerHeight;
		return (
			<Grid>
				<Grid.Row columns={1}>
					<Grid.Column>
						<Segment raised style={{ height: mainHeight * 0.075 }}>
							<Grid>
								<Grid.Row columns={7}>
									<Grid.Column>
										<Header>主标题</Header>
									</Grid.Column>
									<Grid.Column>副标题</Grid.Column>
									<Grid.Column></Grid.Column>
									<Grid.Column></Grid.Column>
									<Grid.Column></Grid.Column>
									<Grid.Column></Grid.Column>
									<Grid.Column>
										<Button onClick={this.outSystem}>退出系统</Button>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={1} style={{ paddingTop: 0 }}>
					<Grid.Column>
						<Segment raised style={{ height: mainHeight * 0.075 }}>
							overview
						</Segment>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={3} style={{ paddingTop: 0 }}>
					<Grid.Column width={3}>
						<Segment raised style={{ height: mainHeight * 0.8 }}>
							charts left
						</Segment>
					</Grid.Column>
					<Grid.Column width={10}>
						<Grid.Row columns={1}>
							<Grid.Column>
								<Segment raised style={{ height: mainHeight * 0.1 }}>
									<MapHeader />
								</Segment>
							</Grid.Column>
							<Grid.Column>
								<AMapContainer
									mapContainerHeight={mainHeight * 0.6}
									trainPartsObv={this.trainPartsObv}
								/>
							</Grid.Column>
							<Grid.Column>
								<Segment raised style={{ height: mainHeight * 0.1 }}>
									map footer
								</Segment>
							</Grid.Column>
						</Grid.Row>
					</Grid.Column>
					<Grid.Column width={3}>
						<Segment raised style={{ height: mainHeight * 0.8 }}>
							charts right
						</Segment>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

const mapStateToProps = ({verified}) => {
    return {
        verified
    }
}

export default connect(mapStateToProps)(IPlatform);
