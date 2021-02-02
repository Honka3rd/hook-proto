import React from "react";
import { Segment } from "semantic-ui-react";
import AMap from "./AMap";
import { capitals, amapKey } from "./constants";
import { connect } from "react-redux";
import { updateCurrentMapInfo } from "./actions";

class AMapContainer extends React.Component {
	render() {
		const { mapContainerHeight } = this.props;
		return (
			<Segment raised style={{ height: mapContainerHeight }}>
				<AMap
					provinceMarks={capitals}
					amapKey={amapKey}
					updateCurrentMapInfo={this.props.updateCurrentMapInfo}
					trainPartsObv={this.props.trainPartsObv}
				/>
			</Segment>
		);
	}
}

const mapStateToProps = ({ currentMapInfo }) => {
	return { currentMapInfo };
};

const mapActionToProps = () => {
	return { updateCurrentMapInfo };
};

export default connect(mapStateToProps, mapActionToProps())(AMapContainer);
