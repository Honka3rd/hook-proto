import React from "react";
import { Segment, Grid } from "semantic-ui-react";
import { ResizeSensor } from "css-element-queries";
import $ from "jquery";

class Carriages extends React.Component {
	trainHeaderId = "train_header";
	trainTailId = "train_tail";
	trainBodyPrefix = "train_body";
	trainBodySkeletonList = [1, 2, 3, 4];

	componentDidMount() {
		this.initAllCanvas([]);
		new ResizeSensor($("body"), this.onBodyResize);
		this.collectCanvasDoms();
	}

	onBodyResize = () => {
		this.initAllCanvas(this.props.faultCarriages);
	};

	componentDidUpdate(preProps) {
		if (this.props.faultCarriages.length) {
			if (this.props.faultCarriages !== preProps.faultCarriages) {
				this.initAllCanvas(this.props.faultCarriages);
			}
		}
	}

	defaultStrokeColor = "#7ED5EA";
	defaultShadowColor = "#63BCE5";
	defaultFillColor = "RGBA(126,213,234,0.6)";

	faultStrokeColor = "#E40C2B";
	faultShadowColor = "#9B1B3B";
	faultFillColor = "RGBA(228,12,43,0.6)";

	sharedContextAttrs = {
		shadowBlur: 0.5,
		lineWidth: 0.5,
		lineJoin: "round",
	};

	initAllCanvas = (faultCarriages) => {
		const headerCvs = document.getElementById(this.trainHeaderId);
		this.adjustCanvasClient(headerCvs);
		if(headerCvs){
			const headerCtx = headerCvs.getContext("2d");
			let headerFault = false;
			let headerStrokeStyle = this.defaultStrokeColor;
			let headerShadowStyle = this.defaultShadowColor;
			let headerFillStyle = this.defaultFillColor;
			if (faultCarriages.length) {
				for (let faultCarriage of faultCarriages) {
					const { carriageNo, front } = faultCarriage;
					if (carriageNo === 0 && front) {
						headerFault = true;
						headerStrokeStyle = this.faultStrokeColor;
						headerShadowStyle = this.faultShadowColor;
						headerFillStyle = this.faultFillColor;
						break;
					}
				}
			}

			this.initContext(headerCtx, {
				strokeStyle: headerStrokeStyle,
				shadowStyle: headerShadowStyle,
				fillStyle: headerFillStyle,
				...this.sharedContextAttrs,
			});
			this.depictHeader(
				headerCtx,
				headerCvs.width,
				headerCvs.height,
				headerFault
			);

			const body1stCvs = document.getElementById(`${this.trainBodyPrefix}_${0}`);
			this.adjustCanvasClient(body1stCvs);
			const body1stCtx = body1stCvs.getContext("2d");
			let firstSrokeStyle = this.defaultStrokeColor;
			let firstShadowStyle = this.defaultShadowColor;
			let firstFillStyle = this.defaultFillColor;
			if (faultCarriages.length) {
				for (let faultCarriage of faultCarriages) {
					const { carriageNo, front } = faultCarriage;
					if (carriageNo === 0 && !front) {
						firstSrokeStyle = this.faultStrokeColor;
						firstShadowStyle = this.faultShadowColor;
						firstFillStyle = this.faultFillColor;
						break;
					}
				}
			}
			this.initContext(body1stCtx, {
				strokeStyle: firstSrokeStyle,
				shadowColor: firstShadowStyle,
				fillStyle: firstFillStyle,
				...this.sharedContextAttrs,
			});
			this.depictBody(body1stCtx, body1stCvs.width, body1stCvs.height, 0);

			const body5thCvs = document.getElementById(`${this.trainBodyPrefix}_${5}`);
			this.adjustCanvasClient(body5thCvs);
			const body5thCtx = body5thCvs.getContext("2d");
			let lastSrokeStyle = this.defaultStrokeColor;
			let lastShadowStyle = this.defaultShadowColor;
			let lastFillStyle = this.defaultFillColor;
			if (faultCarriages.length) {
				for (let faultCarriage of faultCarriages) {
					const { carriageNo, front } = faultCarriage;
					if (carriageNo === 5 && front) {
						lastSrokeStyle = this.faultStrokeColor;
						lastShadowStyle = this.faultShadowColor;
						lastFillStyle = this.faultFillColor;
						break;
					}
				}
			}
			this.initContext(body5thCtx, {
				strokeStyle: lastSrokeStyle,
				shadowColor: lastShadowStyle,
				fillStyle: lastFillStyle,
				...this.sharedContextAttrs,
			});
			this.depictBody(body5thCtx, body5thCvs.width, body5thCvs.height, 1);

			const tailCvs = document.getElementById(this.trainTailId);
			this.adjustCanvasClient(tailCvs);
			const tailCtx = tailCvs.getContext("2d");
			let tailFault = false;
			let tailSrokeStyle = this.defaultStrokeColor;
			let tailShadowStyle = this.defaultShadowColor;
			let tailFillStyle = this.defaultFillColor;
			if (faultCarriages.length) {
				for (let faultCarriage of faultCarriages) {
					const { carriageNo, front } = faultCarriage;
					if (carriageNo === 5 && !front) {
						tailFault = true;
						tailSrokeStyle = this.faultStrokeColor;
						tailShadowStyle = this.faultShadowColor;
						tailFillStyle = this.faultFillColor;
						break;
					}
				}
			}
			this.initContext(tailCtx, {
				strokeStyle: tailSrokeStyle,
				shadowColor: tailShadowStyle,
				fillStyle: tailFillStyle,
				...this.sharedContextAttrs,
			});
			this.depictTail(tailCtx, tailCvs, tailFault);

			for (let sk of this.trainBodySkeletonList) {
				for (let i = 0; i <= 1; i++) {
					const bodyCvs = document.getElementById(
						`${this.trainBodyPrefix}_${sk}_${i}`
					);
					this.adjustCanvasClient(bodyCvs);
					const bodyCtx = bodyCvs.getContext("2d");
					let bodyStrokeStyle = this.defaultStrokeColor;
					let bodyShadowStyle = this.defaultShadowColor;
					let bodyFillStyle = this.defaultFillColor;
					if (faultCarriages.length) {
						for (let faultCarriage of faultCarriages) {
							const { carriageNo, front } = faultCarriage;
							if (carriageNo === sk && !i === front) {
								bodyStrokeStyle = this.faultStrokeColor;
								bodyShadowStyle = this.faultShadowColor;
								bodyFillStyle = this.faultFillColor;
								break;
							}
						}
					}
					this.initContext(bodyCtx, {
						strokeStyle: bodyStrokeStyle,
						shadowColor: bodyShadowStyle,
						fillStyle: bodyFillStyle,
						...this.sharedContextAttrs,
					});
					this.depictBody(bodyCtx, bodyCvs.width, bodyCvs.height, !i);
				}
			}
		}
	};

	adjustCanvasClient = (canvas) => {
		if (canvas) {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		}
	};

	initContext = (context, config) => {
		for (let attr in config) {
			context[attr] = config[attr];
		}
	};

	changeCurrentAxis = (currentAxis, x, y) => {
		currentAxis.width = x;
		currentAxis.height = y;
	};

	depictHeader = (context, clientWidth, clientHeight, headerFault) => {
		if (!context) return;
		context.clearRect(0, 0, clientWidth, clientHeight);
		const currentAxis = { width: 0, height: 0 };
		context.beginPath();
		const mainLineStartPoint = { x: clientWidth * 0.1, y: clientHeight * 0.8 };
		this.changeCurrentAxis(
			currentAxis,
			mainLineStartPoint.x,
			mainLineStartPoint.y
		);
		context.moveTo(currentAxis.width, currentAxis.height);

		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.8);
		context.lineTo(currentAxis.width, currentAxis.height);

		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.2);
		context.lineTo(currentAxis.width, currentAxis.height);

		this.changeCurrentAxis(currentAxis, clientWidth * 0.5, clientHeight * 0.2);
		context.lineTo(currentAxis.width, currentAxis.height);

		context.stroke();
		context.closePath();

		context.beginPath();
		context.moveTo(currentAxis.width, currentAxis.height);
		context.quadraticCurveTo(
			clientWidth * 0.6,
			clientHeight * 0.5,
			mainLineStartPoint.x,
			mainLineStartPoint.y
		);

		context.moveTo(currentAxis.width, currentAxis.height);
		context.bezierCurveTo(
			clientWidth * 0.15,
			clientHeight * 0.4,

			clientWidth * 0.05,
			clientHeight * 0.7,

			clientWidth * 0.1,
			clientHeight * 0.8
		);

		context.stroke();
		const gradient = context.createLinearGradient(
			clientWidth * 0.2,
			clientHeight * 0.2,
			clientWidth * 0.6,
			clientHeight * 0.8
		);

		gradient.addColorStop(
			0,
			headerFault ? "RGBA(228,12,43,0.2)" : "RGBA(126,213,234,0.1)"
		);
		gradient.addColorStop(
			0.25,
			headerFault ? "RGBA(228,12,43,0.4)" : "RGBA(126,213,234,0.3)"
		);
		gradient.addColorStop(
			0.5,
			headerFault ? "RGBA(228,12,43,0.6)" : "RGBA(126,213,234,0.5)"
		);
		gradient.addColorStop(
			0.75,
			headerFault ? "RGBA(228,12,43,0.8)" : "RGBA(126,213,234,0.7)"
		);
		gradient.addColorStop(
			1,
			headerFault ? "RGBA(228,12,43,1)" : "RGBA(126,213,234,0.9)"
		);

		this.initContext(context, { fillStyle: gradient });

		context.fill();
		context.closePath();
		this.initContext(context, {
			fillStyle: headerFault ? "RGBA(228,12,43,0.4)" : "RGBA(126,213,234,0.8)",
		});

		context.beginPath();
		context.moveTo(currentAxis.width + clientWidth * 0.05, currentAxis.height);
		context.quadraticCurveTo(
			clientWidth * 0.65,
			clientHeight * 0.5,
			mainLineStartPoint.x + clientWidth * 0.05,
			mainLineStartPoint.y
		);
		context.stroke();
		context.closePath();

		this.changeCurrentAxis(
			currentAxis,
			mainLineStartPoint.x,
			mainLineStartPoint.y
		);

		context.beginPath();
		context.moveTo(currentAxis.width, currentAxis.height);
		context.quadraticCurveTo(
			clientWidth * 0.21,
			clientHeight * 0.935,
			clientWidth * 0.25,
			clientHeight * 0.925
		);

		this.changeCurrentAxis(
			currentAxis,
			clientWidth * 0.25,
			clientHeight * 0.925
		);

		context.moveTo(currentAxis.width, currentAxis.height);

		this.changeCurrentAxis(
			currentAxis,
			clientWidth * 0.35,
			clientHeight * 0.925
		);

		context.lineTo(currentAxis.width, currentAxis.height);

		context.stroke();
		context.closePath();

		context.beginPath();

		this.changeCurrentAxis(currentAxis, clientWidth * 0.25, clientHeight * 0.8);
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth * 0.45, clientHeight * 0.8);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(
			currentAxis,
			clientWidth * 0.4,
			clientHeight * 0.925
		);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(
			currentAxis,
			clientWidth * 0.35,
			clientHeight * 0.925
		);
		context.lineTo(currentAxis.width, currentAxis.height);

		context.quadraticCurveTo(
			clientWidth * 0.3,
			clientHeight * 0.925,
			clientWidth * 0.25,
			clientHeight * 0.8
		);

		context.stroke();
		context.closePath();
		context.fill();

		context.beginPath();
		this.changeCurrentAxis(currentAxis, clientWidth * 0.7, clientHeight * 0.8);
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(
			currentAxis,
			clientWidth * 0.735,
			clientHeight * 0.925
		);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.925);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.8);
		context.lineTo(currentAxis.width, currentAxis.height);
		context.stroke();
		context.closePath();
		context.fill();

		context.beginPath();
		this.changeCurrentAxis(
			currentAxis,
			clientWidth * 0.45,
			clientHeight * 0.875
		);

		context.arc(
			currentAxis.width,
			currentAxis.height,
			clientWidth * 0.075,
			2 * Math.PI * 0.9,
			2 * Math.PI * 0.4
		);
		context.stroke();
		context.closePath();

		context.beginPath();
		this.initContext(context, {
			strokeStyle: headerFault
				? "RGBA(228,12,43,0.4)"
				: "RGBA(126,213,234,0.4)",
			lineWidth: 2,
		});
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(
			currentAxis,
			clientWidth * 0.7,
			clientHeight * 0.875
		);
		context.lineTo(currentAxis.width, currentAxis.height);
		context.stroke();
		context.closePath();
		this.initContext(context, {
			strokeStyle: headerFault ? "#E40C2B" : "#7ED5EA",
			lineWidth: 0.5,
		});
		context.beginPath();
		context.arc(
			currentAxis.width,
			currentAxis.height,
			clientWidth * 0.075,
			2 * Math.PI * 1.1,
			2 * Math.PI * 0.6
		);
		context.stroke();
		context.closePath();

		context.beginPath();
		this.changeCurrentAxis(currentAxis, clientWidth * 0.7, clientHeight * 0.3);
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth * 0.9, clientHeight * 0.3);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth * 0.9, clientHeight * 0.6);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth * 0.55, clientHeight * 0.6);
		context.lineTo(currentAxis.width, currentAxis.height);

		context.quadraticCurveTo(
			clientWidth * 0.68,
			clientHeight * 0.45,
			clientWidth * 0.7,
			clientHeight * 0.3
		);

		context.closePath();
		context.fill();

		context.beginPath();
		this.changeCurrentAxis(currentAxis, clientWidth * 0.6, clientHeight * 0.2);
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(
			currentAxis,
			clientWidth * 0.65,
			clientHeight * 0.15
		);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.15);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.2);
		context.lineTo(currentAxis.width, currentAxis.height);
		context.stroke();
		context.closePath();
		context.fill();
	};

	depictTail = (context, tailCvs, tailFault) => {
		if (!context) return;
		this.depictHeader(context, tailCvs.width, tailCvs.height, tailFault);
		tailCvs.style.transform = "rotate3d(0, 1, 0, 180deg)";
	};

	depictBody = (context, clientWidth, clientHeight, i, bodyIndex) => {
		if (!context) return;
		context.clearRect(0, 0, clientWidth, clientHeight);
		const bufferLength = clientWidth * 0.15;
		if (!i) {
			this.depictCarriageUnit(
				context,
				clientWidth - bufferLength,
				clientHeight,
				0
			);
			this.depictBuffer(
				context,
				clientWidth,
				clientHeight,
				bufferLength,
				"right"
			);
		} else {
			this.depictBuffer(
				context,
				clientWidth,
				clientHeight,
				bufferLength,
				"left"
			);
			this.depictCarriageUnit(context, clientWidth, clientHeight, bufferLength);
		}
	};

	depictBuffer = (
		context,
		clientWidth,
		clientHeight,
		bufferLength,
		direction
	) => {
		if (direction === "right") {
			const currentAxis = { width: 0, height: 0 };
			context.beginPath();
			this.changeCurrentAxis(
				currentAxis,
				clientWidth - bufferLength,
				clientHeight * 0.2
			);
			context.moveTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.95,
				clientHeight * 0.2
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				currentAxis.width,
				clientHeight * 0.8
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth - bufferLength,
				clientHeight * 0.8
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			context.stroke();
			context.closePath();

			context.beginPath();
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.95,
				clientHeight * 0.3
			);
			context.moveTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.3);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.7);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.95,
				clientHeight * 0.7
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			context.stroke();
			context.closePath();
			context.fill();
		} else if (direction === "left") {
			const currentAxis = { width: 0, height: 0 };
			context.beginPath();
			this.changeCurrentAxis(currentAxis, bufferLength, clientHeight * 0.2);
			context.moveTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				bufferLength - clientWidth * 0.1,
				clientHeight * 0.2
			);
			context.lineTo(currentAxis.width, currentAxis.height);

			this.changeCurrentAxis(
				currentAxis,
				bufferLength - clientWidth * 0.1,
				clientHeight * 0.8
			);
			context.lineTo(currentAxis.width, currentAxis.height);

			this.changeCurrentAxis(currentAxis, bufferLength, clientHeight * 0.8);
			context.lineTo(currentAxis.width, currentAxis.height);

			context.stroke();
			context.closePath();

			context.beginPath();
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.05,
				clientHeight * 0.3
			);
			context.moveTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(currentAxis, 0, clientHeight * 0.3);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(currentAxis, 0, clientHeight * 0.7);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.05,
				clientHeight * 0.7
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			context.stroke();
			context.closePath();
			context.fill();
		}
	};

	depictCarriageUnit = (context, clientWidth, clientHeight, startWidth) => {
		context.beginPath();
		const currentAxis = { width: 0, height: 0 };
		this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.8);
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.8);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.2);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.2);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.8);
		context.lineTo(currentAxis.width, currentAxis.height);
		context.stroke();
		context.closePath();

		context.beginPath();
		this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.2);
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.15);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.15);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.2);
		context.lineTo(currentAxis.width, currentAxis.height);
		context.stroke();
		context.closePath();
		context.fill();

		context.beginPath();
		this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.6);
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.6);
		context.lineTo(currentAxis.width, currentAxis.height);
		context.stroke();
		context.closePath();
		context.fill();

		if (!startWidth) {
			context.beginPath();
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.5,
				clientHeight * 0.925
			);
			context.moveTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.925);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(currentAxis, clientWidth, clientHeight * 0.8);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.5,
				clientHeight * 0.8
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.5,
				clientHeight * 0.925
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			context.stroke();
			context.closePath();
			context.fill();

			context.beginPath();
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.15,
				clientHeight * 0.875
			);

			context.arc(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.09,
				2 * Math.PI * 0.85,
				2 * Math.PI * 0.65
			);
			context.stroke();
			context.closePath();

			context.beginPath();
			this.initContext(context, {
				lineWidth: 2,
			});
			context.moveTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.45,
				clientHeight * 0.875
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			context.stroke();
			context.closePath();
			this.initContext(context, { lineWidth: 0.5 });
			context.beginPath();
			context.arc(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.085,
				2 * Math.PI * 1.1,
				2 * Math.PI * 0.6
			);
			context.stroke();
			context.closePath();
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.2,
				clientHeight * 0.3
			);
			this.depictRoundedRect(
				context,
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.6,
				clientHeight * 0.6,
				clientWidth * 0.025
			);

			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.25,
				clientHeight * 0.4
			);
			context.fillRect(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.1,
				clientHeight * 0.15
			);

			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.425,
				clientHeight * 0.4
			);
			context.fillRect(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.1,
				clientHeight * 0.15
			);

			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.75,
				clientHeight * 0.4
			);
			context.fillRect(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.1,
				clientHeight * 0.15
			);
		} else {
			context.beginPath();
			this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.925);
			context.moveTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.575,
				clientHeight * 0.925
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.575,
				clientHeight * 0.8
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.8);
			context.lineTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(currentAxis, startWidth, clientHeight * 0.925);
			context.lineTo(currentAxis.width, currentAxis.height);
			context.stroke();
			context.closePath();
			context.fill();

			context.beginPath();
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.65,
				clientHeight * 0.875
			);

			context.arc(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.075,
				2 * Math.PI * 0.85,
				2 * Math.PI * 0.4
			);
			context.stroke();
			context.closePath();

			context.beginPath();
			this.initContext(context, {
				lineWidth: 2,
			});
			context.moveTo(currentAxis.width, currentAxis.height);
			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.9,
				clientHeight * 0.875
			);
			context.lineTo(currentAxis.width, currentAxis.height);
			context.stroke();
			context.closePath();
			this.initContext(context, { lineWidth: 0.5 });
			context.beginPath();
			context.arc(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.075,
				2 * Math.PI * 0.85,
				2 * Math.PI * 0.6
			);
			context.stroke();
			context.closePath();

			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.35,
				clientHeight * 0.3
			);
			this.depictRoundedRect(
				context,
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.7,
				clientHeight * 0.6,
				clientWidth * 0.025
			);

			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.39,
				clientHeight * 0.4
			);
			context.fillRect(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.08,
				clientHeight * 0.15
			);

			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.55,
				clientHeight * 0.4
			);
			context.fillRect(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.08,
				clientHeight * 0.15
			);

			this.changeCurrentAxis(
				currentAxis,
				clientWidth * 0.8,
				clientHeight * 0.4
			);
			context.fillRect(
				currentAxis.width,
				currentAxis.height,
				clientWidth * 0.08,
				clientHeight * 0.15
			);
		}
	};

	depictRoundedRect = (context, x, y, clientWidth, clientHeight, r) => {
		if (!context) return;
		const currentAxis = { width: x + r, height: y };
		context.beginPath();
		context.moveTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, clientWidth - 2 * r, y);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, currentAxis.width, y + r);
		context.stroke();
		context.closePath();
		context.beginPath();
		context.arc(
			currentAxis.width,
			currentAxis.height,
			r,
			0,
			-0.5 * Math.PI,
			true
		);

		context.stroke();
		context.closePath();

		context.beginPath();
		this.changeCurrentAxis(currentAxis, clientWidth - r, y);
		context.moveTo(currentAxis.width, currentAxis.height + r);
		this.changeCurrentAxis(
			currentAxis,
			clientWidth - r,
			clientHeight * 0.8 + y + r
		);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, x, currentAxis.height);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(currentAxis, x, y + r);
		context.lineTo(currentAxis.width, currentAxis.height);
		this.changeCurrentAxis(
			currentAxis,
			currentAxis.width + r,
			currentAxis.height
		);

		context.stroke();
		context.closePath();

		context.beginPath();
		context.arc(
			currentAxis.width,
			currentAxis.height,
			r,
			-0.5 * Math.PI,
			Math.PI,
			true
		);

		context.stroke();
		context.closePath();
	};

	canvasCollection = [];
	collectCanvasDoms = () => {
		this.trainBodySkeletonList.forEach((i) => {
			this.canvasCollection.push(
				document.getElementById(`${this.trainBodyPrefix}_${i}`)
			);
		});
	};

	onCanvasClick = (e, carriageId) => {
		if (!this.canvasCollection.length) return;
		e.stopPropagation();
		const selected = document.getElementById(carriageId);
		if (selected) {
			this.props.onCarriageClick(carriageId);
		}
	};

	onCanvasHover = (e, carriageId) => {
		if (!this.canvasCollection.length) return;
		e.stopPropagation();
		const selected = document.getElementById(carriageId);
		if (selected) {
			selected.style.border = "RGBA(126,213,234,0.3) solid 0.5px";
		}
	};

	onLeaveCanvas = (e, carriageId) => {
		if (!this.canvasCollection.length) return;
		e.stopPropagation();
		const selected = document.getElementById(carriageId);
		if (selected) {
			selected.style.border = "none";
		}
	};

	renderCarriageHeader = (carriageStyle) => {
		return (
			<Grid.Column width={2} style={{ padding: 0 }}>
				<Grid style={{ width: "100%", marginLeft: 0, marginRight: 0 }}>
					<Grid.Row columns={2}>
						<Grid.Column style={{ padding: 0 }}>
							<div style={carriageStyle}>
								<canvas
									id={this.trainHeaderId}
									style={{
										width: "100%",
										height: "100%",
										// cursor: "pointer",
										borderRadius: "5%",
										zIndex: 2,
									}}
								/>
							</div>
						</Grid.Column>
						<Grid.Column style={{ padding: 0 }}>
							<div style={carriageStyle}>
								<canvas
									id={`${this.trainBodyPrefix}_0`}
									style={{
										width: "100%",
										height: "100%",
										// cursor: "pointer",
										borderRadius: "5%",
										zIndex: 2,
									}}
								/>
							</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Grid.Column>
		);
	};

	renderCarriageBodies = (carriageStyle) => {
		return this.trainBodySkeletonList.map((i) => {
			return (
				<Grid.Column width={2} key={i} style={{ padding: 0 }}>
					<Grid
						id={`${this.trainBodyPrefix}_${i}`}
						style={{
							width: "100%",
							marginLeft: 0,
							marginRight: 0,
							borderRadius: "10%",
							transition: "0.5s",
						}}
						/* onMouseEnter={(e) => {
							this.onCanvasHover(e, `${this.trainBodyPrefix}_${i}`);
						}}
						onMouseLeave={(e) => {
							this.onLeaveCanvas(e, `${this.trainBodyPrefix}_${i}`)
						}}
						onClick={(e) =>
							this.onCanvasClick(e, `${this.trainBodyPrefix}_${i}`)
						} */
					>
						<Grid.Row columns={2}>
							<Grid.Column style={{ padding: 0 }}>
								<div style={carriageStyle}>
									<canvas
										id={`${this.trainBodyPrefix}_${i}_0`}
										style={{
											width: "100%",
											height: "100%",
											// cursor: "pointer",
											borderRadius: "5%",
											zIndex: 2,
										}}
									/>
								</div>
							</Grid.Column>
							<Grid.Column style={{ padding: 0 }}>
								<div style={carriageStyle}>
									<canvas
										id={`${this.trainBodyPrefix}_${i}_1`}
										style={{
											width: "100%",
											height: "100%",
											// cursor: "pointer",
											borderRadius: "5%",
											zIndex: 2,
										}}
									/>
								</div>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Grid.Column>
			);
		});
	};

	renderCarriageTail = (carriageStyle) => {
		return (
			<Grid.Column width={2} style={{ padding: 0 }}>
				<Grid.Row>
					<Grid style={{ width: "100%", marginLeft: 0, marginRight: 0 }}>
						<Grid.Row columns={2}>
							<Grid.Column style={{ padding: 0 }}>
								<div style={carriageStyle}>
									<canvas
										id={`${this.trainBodyPrefix}_5`}
										style={{
											width: "100%",
											height: "100%",
											// cursor: "pointer",
											borderRadius: "5%",
											zIndex: 2,
										}}
									/>
								</div>
							</Grid.Column>
							<Grid.Column style={{ padding: 0 }}>
								<div style={carriageStyle}>
									<canvas
										id={this.trainTailId}
										style={{
											width: "100%",
											height: "100%",
											// cursor: "pointer",
											borderRadius: "5%",
											zIndex: 2,
										}}
									/>
								</div>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Grid.Row>
			</Grid.Column>
		);
	};

	render() {
		const carriageStyle = {
			padding: 0,
			margin: 0,
			height: "10vh",
		};

		const { height, backgroundColor, zIndex, top } = this.props;
		return (
			<Segment
				raised
				onClick={this.onCanvasClick}
				style={{
					height,
					backgroundColor,
				}}>
				<Grid>
					<Grid.Row columns={12} style={{ zIndex, top }}>
						<Grid.Column width={2} style={{ padding: 0 }}></Grid.Column>
						{this.renderCarriageHeader(carriageStyle)}
						{this.renderCarriageBodies(carriageStyle)}
						{this.renderCarriageTail(carriageStyle)}
						<Grid.Column width={2} style={{ padding: 0 }}></Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		);
	}
}

export default Carriages;
