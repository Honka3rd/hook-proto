import React from "react";
import Echarts from "echarts";

class HistoricalComponent extends React.Component {
	constructor(props) {
		super(props);
		this.echartsContainerRef = React.createRef();
		this.historicalCharts = null;
		this.currTime = 0;
	}

	componentDidMount() {
		this.historicalCharts = Echarts.init(this.echartsContainerRef.current);
		this.historicalCharts.on("datazoom", this.onDataZoomChange);
		window.onresize = this.historicalCharts.resize;
		this.historicalCharts.setOption(this.initPropsToOption());
	}

	onDataZoomChange = (args) => {
		const { onDatazoom, debounceDatazoomDuration } = this.props;
		if (!debounceDatazoomDuration) {
			if (typeof onDatazoom === "function") {
				onDatazoom.call(null, args);
			}
		} else {
			if (!this.currTime) {
				this.currTime = new Date().getTime();
				if (typeof onDatazoom === "function") {
					onDatazoom.call(null, args);
				}
			} else {
				const ts = new Date().getTime();
				const period = ts - this.currTime;
				if (typeof debounceDatazoomDuration === "number") {
					if (
						typeof onDatazoom === "function" &&
						period >= debounceDatazoomDuration
					) {
						this.currTime = ts;
						onDatazoom.call(null, args);
					}
				}
			}
		}
	};

	idleUpdateData = (dates, seriesDataUpdate) => {
		if (window.requestIdleCallback) {
			window.requestIdleCallback((deadline) => {
				if (deadline.timeRemaining() >= 1) {
					this.updateSeries(dates, seriesDataUpdate);
				}
			});
		} else {
			this.updateSeries(dates, seriesDataUpdate);
		}
	};

	componentDidUpdate(preProps) {
		const {
			seriesDataUpdate,
			dates,
			title,
			grid,
			toolbox,
			tooltip,
			legend,
			dataZoom,
			restOptions,
			xAxis,
			yAxis,
		} = this.props;
		if (
			preProps.seriesDataUpdate !== seriesDataUpdate ||
			preProps.dates !== dates
		) {
			if (seriesDataUpdate instanceof Array && dates instanceof Array) {
				this.idleUpdateData(dates, seriesDataUpdate);
			}
		}

		if (preProps.title !== title && title instanceof Object) {
			const option = this.historicalCharts.getOption();
			option.title = Object.assign({}, title);
			this.historicalCharts.setOption(option);
		}

		if (preProps.grid !== grid && grid instanceof Object) {
			const option = this.historicalCharts.getOption();
			option.grid = Object.assign({}, grid);
			this.historicalCharts.setOption(option);
		}

		if (preProps.toolbox !== toolbox && toolbox instanceof Object) {
			const option = this.historicalCharts.getOption();
			option.toolbox = Object.assign({}, toolbox);
			this.historicalCharts.setOption(option);
		}

		if (preProps.tooltip !== tooltip && tooltip instanceof Object) {
			const option = this.historicalCharts.getOption();
			option.tooltip = Object.assign({}, tooltip);
			this.historicalCharts.setOption(option);
		}

		if (preProps.legend !== legend && legend instanceof Object) {
			const option = this.historicalCharts.getOption();
			option.legend = Object.assign({}, legend);
			this.historicalCharts.setOption(option);
		}

		if (preProps.dataZoom !== dataZoom && dataZoom instanceof Object) {
			const option = this.historicalCharts.getOption();
			option.dataZoom = Object.assign({}, dataZoom);
			this.historicalCharts.setOption(option);
		}

		if (preProps.xAxis !== xAxis && xAxis instanceof Object) {
			const option = this.historicalCharts.getOption();
			option.xAxis = Object.assign({}, xAxis);
			this.historicalCharts.setOption(option);
		}

		if (preProps.yAxis !== yAxis && yAxis instanceof Object) {
			const option = this.historicalCharts.getOption();
			option.yAxis = Object.assign({}, yAxis);
			this.historicalCharts.setOption(option);
		}

		if (preProps.restOptions !== restOptions && restOptions instanceof Object) {
			const option = this.historicalCharts.getOption();
			for (let opt in restOptions) {
				const attr = restOptions[opt];
				if (attr instanceof Array) {
					option[opt] = { ...attr };
				} else if (typeof attr === "object") {
					option[opt] = [...attr];
				} else {
					option[opt] = attr;
				}
			}
			this.historicalCharts.setOption(option);
		}
	}

	updateSeries = (dates, seriesDataUpdate) => {
		const TypeException = function () {
			this.name = "TypeException";
			this.message = "type error";
		};
		try {
			const option = this.historicalCharts.getOption();
			const xAxis = option.xAxis[0];

			option.xAxis = [{ ...xAxis, data: dates }];

			const preSeries = option.series;

			let series = seriesDataUpdate.map(({ name, type, data, rest }) => {
				if (!name || !(data instanceof Array)) {
					throw new TypeException();
				}

				preSeries.splice(
					preSeries.indexOf(preSeries.find((s) => s.name === name)),
					1
				);

				return {
					name: `${name}`,
					type,
					data,
					...Object.assign({}, rest),
				};
			});

			preSeries.forEach((s) => {
				s.data = null;
			});

			series = [...series, ...preSeries];

			option.series = series;
			this.historicalCharts.clear();
			this.historicalCharts.setOption(option);
		} catch (error) {}
	};

	initPropsToOption = () => {
		try {
			const {
				title,
				grid,
				toolbox,
				tooltip,
				legend,
				dataZoom,
				xAxis,
				yAxis,
				series,
				restOptions,
			} = this.props;

			const optList = [
				title,
				grid,
				toolbox,
				tooltip,
				legend,
				xAxis,
				yAxis,
				dataZoom,
				series,
				restOptions,
			];

			let option;
			if (optList.some((opt) => typeof opt !== "undefined")) {
				option = {};

				if (title) {
					option.title = title;
				}

				if (grid) {
					option.grid = grid;
				}

				if (toolbox) {
					option.toolbox = toolbox;
				}

				if (tooltip) {
					option.tooltip = tooltip;
				}

				if (legend) {
					option.legend = legend;
				}

				if (xAxis) {
					option.xAxis = xAxis;
				}

				if (yAxis) {
					option.yAxis = yAxis;
				}

				if (dataZoom) {
					option.dataZoom = dataZoom;
				}

				if (series) {
					option.series = series;
				}

				if (restOptions instanceof Object) {
					for (let attr in restOptions) {
						option[attr] = restOptions[attr];
					}
				}

				return option;
			}
			return this.setDefault();
		} catch (error) {
			return this.setDefault();
		}
	};

	setDefault = () => {
		const {
			title,
			grid,
			toolbox,
			tooltip,
			legend,
			dataZoom,
			xAxis,
			yAxis,
			series,
			restOptions,
		} = HistoricalComponent.defaultProps;

		return {
			title,
			grid,
			toolbox,
			tooltip,
			legend,
			dataZoom,
			xAxis,
			yAxis,
			series,
			restOptions,
		};
	};

	render() {
		const { containerStyle } = this.props;
		return (
			<div
				style={{
					...containerStyle,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					overflow: "visible",
				}}>
				<div
					ref={this.echartsContainerRef}
					style={{ width: "inherit", height: "inherit" }}
				/>
			</div>
		);
	}
}

HistoricalComponent.defaultProps = {
	containerStyle: {
		width: "100%",
		height: "40vh",
		containerPadding: "5px",
		margin: "0 auto 0 auto",
	},
	seriesDataUpdate: [],
	dates: [],
	grid: {
		bottom: 50,
	},
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "cross",
			animation: false,
			label: {
				backgroundColor: "#505765",
			},
		},
	},
	legend: {
		data: ["S_1"],
		left: 10,
	},
	dataZoom: [
		{
			show: true,
			realtime: false,
			start: 0,
			end: 100,
		},
		{
			type: "inside",
			realtime: false,
			start: 0,
			end: 100,
		},
	],
	xAxis: {
		type: "category",
		boundaryGap: false,
		axisLine: { onZero: false },
		data: [],
	},
	yAxis: {
		name: "Value",
		type: "value",
	},
	series: [
		{
			name: "S_1",
			type: "line",
			lineStyle: {
				width: 1,
			},
			emphasis: {
				focus: "series",
			},
			data: [],
		},
	],
	restOptions: {},
};

export default HistoricalComponent;
