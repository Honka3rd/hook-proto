import React from "react";
import { Segment, Card } from "semantic-ui-react";

class RealtimeAdvice extends React.Component {
	render() {
		return (
			<Segment
				raised
				style={{
					height: this.props.height,
					backgroundColor: "#150734",
				}}><Card.Group itemsPerRow={2}>
					<Card
						centered
						style={{
							top: "30%",
							backgroundColor: "#4B9FE1",
						}}>
						<Card.Content>
							<Card.Header style={{ color: "aliceblue",fontFamily: "chinese_char_design" }}>SH63-02车钩缓冲系统</Card.Header>
							<Card.Meta style={{ color: "aliceblue",fontFamily: "chinese_char_design" }}>
								缓冲器泄露故障
						</Card.Meta>
							<Card.Description style={{ fontFamily: "chinese_char_design" }}>
								运营：继续运营
      					</Card.Description>
							<Card.Description style={{ fontFamily: "chinese_char_design" }}>
								维护：准备更换缓冲器
      					</Card.Description>
						</Card.Content>
					</Card>
					<Card
						centered
						style={{
							top: "30%",
							backgroundColor: "#4B9FE1",
						}}>
						<Card.Content>
							<Card.Header style={{ color: "aliceblue",fontFamily: "chinese_char_design" }}>SH63-02车钩缓冲系统</Card.Header>
							<Card.Meta style={{ color: "aliceblue",fontFamily: "chinese_char_design" }}>
								缓冲器泄露故障
						</Card.Meta>
							<Card.Description style={{ fontFamily: "chinese_char_design" }}>
								运营：继续运营
      					</Card.Description>
							<Card.Description style={{ fontFamily: "chinese_char_design" }}>
								维护：准备更换缓冲器
      					</Card.Description>
						</Card.Content>
					</Card>
					<Card
						centered
						style={{
							top: "30%",
							backgroundColor: "#4B9FE1",
						}}>
						<Card.Content>
							<Card.Header style={{ color: "aliceblue",fontFamily: "chinese_char_design" }}>SH63-02车钩缓冲系统</Card.Header>
							<Card.Meta style={{ color: "aliceblue",fontFamily: "chinese_char_design" }}>
								缓冲器泄露故障
						</Card.Meta>
							<Card.Description style={{ fontFamily: "chinese_char_design" }}>
								运营：继续运营
      					</Card.Description>
							<Card.Description style={{ fontFamily: "chinese_char_design" }}>
								维护：准备更换缓冲器
      					</Card.Description>
						</Card.Content>
					</Card>
					<Card
						centered
						style={{
							top: "30%",
							backgroundColor: "#4B9FE1",
						}}>
						<Card.Content>
							<Card.Header style={{ color: "aliceblue",fontFamily: "chinese_char_design" }}>SH63-02车钩缓冲系统</Card.Header>
							<Card.Meta style={{ color: "aliceblue",fontFamily: "chinese_char_design" }}>
								缓冲器泄露故障
						</Card.Meta>
							<Card.Description style={{ fontFamily: "chinese_char_design" }}>
								运营：继续运营
      					</Card.Description>
							<Card.Description style={{ fontFamily: "chinese_char_design" }}>
								维护：准备更换缓冲器
      					</Card.Description>
						</Card.Content>
					</Card>
				</Card.Group>
			</Segment>
		);
	}
}

export default RealtimeAdvice;