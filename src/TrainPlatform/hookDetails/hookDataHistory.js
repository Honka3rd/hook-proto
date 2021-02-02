import React from "react";
import { connect } from "react-redux";
import $ from "jquery";
import HistoricalComponent from "../../lib/historicalComponent/historicalChart";
import HistoryDateChoose from "./historyDataChoose.js";
import "../../FontEffects/chinese_char_design.css";
import { Checkbox, Sidebar } from "semantic-ui-react";
import { REALTIME_TEST } from "../constants";
import { fillAryWithDefault, separateArrayOutofObject, awaitMergeArrayByKey } from "../../lib//algorithms//MapRestArrayByArray"
import Axios from "axios";

class HookDataHistory extends React.Component {

  constructor(props) {
    super(props);
    this.axiosInstance = Axios.create({
      baseURL: REALTIME_TEST,
    });
    this.state = {
      isButtonDone: true,
      isDone: false,
      receivedata: {},
      checked: false,
      timeGranule: null,
      tips: null,
      startTime: null,
      endTime: null,
      zoomstartTime: null,
      zoomendTime: null,
      title: {
        text: "历史数据",
        textStyle: {
          color: "#85FFFF",
          fontSize: "120%",
          fontWeight: "bold",
          fontFamily: "monospace",
        },
        left: "2%",
        top: "3%",
        align: "right",
      },
      grid: {
        // bottom: "20%",
        containLabel: true,
      },
      toolbox: {
        show: false,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
        left: "70%",
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
        data: [

        ],
        left: "12%",
        top: "3%",
        width: `${this.props.width * 1.5}px`,
        height: "200px",
        // itemHeight:'1000px',
        itemGap: 25,
        textStyle: {
          color: "#85FFFF",
          fontSize: "80%",
          fontWeight: "bold",
          fontFamily: "chinese_char_design",
        },
        inactiveColor: "white",
        icon: "circle",
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          handleIcon:
            "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          handleSize: "80%",
          handleStyle: {
            color: "white",
            shadowBlur: 3,
            shadowColor: "rgba(0, 0, 0, 0.6)",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          textStyle: {
            color: "white",
          },
        },
        {
          type: "inside",
          realtime: true,
          start: 0,
          end: 100,
        },
      ],
      xAxis: [
        {
          name: "时间",
          type: "category",
          boundaryGap: false,
          axisLabel: {
            color: "white",
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "white",
            },
          },
          data: [],
        },
      ],
      yAxis: {
        name: "值",
        type: "value",
        //max: 120,
        axisLabel: {
          color: "white",
        },
        axisLine: {
          lineStyle: {
            color: "white",
          },
        },
        nameTextStyle: {
          color: "white",
        },
        splitLine: { show: false },
      },
      series: [
        {
          name: "GHChannel1",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel2",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel3",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel4",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel5",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel6",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel7",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel8",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel9",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel10",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel11",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel12",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel13",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
        {
          name: "GHChannel14",
          type: "line",
          areaStyle: {},
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        },
      ],
      restOptions: {}, // echarts其他属性
      seriesDataUpdate: [], // Y轴的各个数据序列
      dates: [], // X轴时间字符串序列
    };
  }

  tempData = {};
  componentDidUpdate(preProps, preState) {
    if (
      this.state.timeGranule &&
      this.state.tips &&
      this.state.startTime &&
      this.state.endTime
    ) {
      if (
        preState.timeGranule !== this.state.timeGranule ||
        preState.tips !== this.state.tips ||
        preState.startTime !== this.state.startTime ||
        preState.endTime !== this.state.endTime
      ) {
        this.setState({
          legend: {
            data: this.state.tips,
          }
        });

        //请求数据
        for (let key = 0; key < this.state.tips.length; key++) {
          this.updateData(this.state.tips[key], key);
        }
        //清空数组便于下次更新数据
        this.tempData = {};
      }
    }
    //根据更新的isDone状态进行数据处理，处理完重置isDone
    if (this.state.isDone) {
      if (JSON.stringify(this.state.receivedata) !== '{}') {
        this.processDataWithAlgs(this.state.receivedata, this.state.tips)
      }
    }
    //isButtonDone状态重置为true
    if (!this.state.isButtonDone && preState.isButtonDone !== this.state.isButtonDone) {
      this.setState({
        isButtonDone: true
      })
    }
  }

  processDataWithAlgs = (data, tips) => {
    //将对象里的值从string变为数字类型
    for (let key in data) {
      for (let index in data[key]) {
        data[key][index] = parseFloat(data[key][index])
      }
    }
    //删除没有数据的tips
    const tipsForAry = [];
    for (let key of tips) {
      if (data.hasOwnProperty(key)) {
        tipsForAry.push(key)
      }
    }
    //处理数据得到[{date:xxx,channel1:xxx},{date:xxx,channel1:xxx},{date:xxx,channel2:xxx}]
    const dataList = {};
    for (let key in data) {
      const dataListTemp = [];
      for (let index in data[key]) {
        dataListTemp.push({
          date: index,
          [key]: data[key][index]
        })
      }
      dataList[key] = dataListTemp;
    }
    //格式转变为：[{date:xxx,channel1:xxx，channel2:xxx},{date:xxx,channel1:xxx,channel2:xxx}]
    awaitMergeArrayByKey(dataList, "date").then(
      (resultList) => {
        const tempData = resultList;
        tipsForAry.push('date');
        const g = fillAryWithDefault(tipsForAry, tempData, 0)
        tipsForAry.pop();
        //   改为Echart格式
        const hisData = separateArrayOutofObject(g)
        // setstate
        this.fillState(hisData);
      }
    ).then(
      this.setState({
        isDone: false,
        isButtonDone: false,
      })
    );
  }

  fillState = (array) => {
    const dataX = [];
    for (let key in array) {
      if (key === "date") {
        for (let index of array[key]) {
          const time = new Date(parseInt(index));
          dataX.push(time)
        }
      }
    }

    const optionData = [];
    for (let key in array) {
      if (key !== "date") {
        const temp = {
          name: key,
          type: "line",
          data: array[key],
          rest: {
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
          },
        };
        optionData.push(temp);
      }
    }
    this.setState({
      dates: dataX,
      seriesDataUpdate: optionData, //外部处理好的数据
    });
  }

  updateData = async (tips, index) => {
    const dataRes = await this.requestData(tips);
    if (JSON.stringify(dataRes) !== '{}') {
      this.tempData[tips] = dataRes[tips];
    }
    //请求到的数据更新state
    this.setState({
      receivedata: this.tempData,
    })
    //判断进行到最后一层添加数据的过程，对isDone状态更新
    if (index === 0) {
      this.setState({
        isDone: true
      })
    }
  };

  requestData = async (tips) => {
    const param =
      "work_status_sampleV2?aggregation_fun=" +
      this.state.timeGranule +
      "&device_no=D00&monitor_var=" +
      tips +
      "&start_time=" +
      this.state.startTime +
      "&end_time=" +
      this.state.endTime;
    const response = await this.axiosInstance.get(param);
    return this.handleResponse(response);
  };

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

  onCheckedChange = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  changeTimeGranule = (timeData) => {
    this.setState({
      timeGranule: timeData,
    });
  };

  changeTips = (tipsData) => {
    this.setState({
      tips: tipsData,
    });
  };

  changeStartTime = (time) => {
    this.setState({
      startTime: time,
    });
  };

  changeEndTime = (time) => {
    this.setState({
      endTime: time,
    });
  };

  render() {
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
      // 以上全是样式初始化，创建组件时可以初始化一次
      // 需要调整时可以后来单独传入，组件会更新

      // 以下是更新数据
      seriesDataUpdate, // Y轴所有更新数据
      dates, // X轴的时间
    } = this.state;
    return (
      <div style={{ padding: 0, backgroundColor: "#150734" }}>
        <Checkbox
          toggle
          checked={this.state.checked}
          onChange={this.onCheckedChange}
          label={<label style={{ color: "white" }}>选择时间</label>}
          style={{ position: "absolute", right: "20px", top: "50vh" }}
        />
        <Sidebar.Pushable as={"div"}>
          <Sidebar
            as={"div"}
            animation="overlay"
            icon="labeled"
            direction="right"
            vertical="true"
            visible={this.state.checked}
            width="thin"
            style={{
              width: "920px",
              boxShadow: "none",
              border: 0,
              position: "absolute",
              top: "5vh",
            }}
          >
            <HistoryDateChoose
              height={this.props.height}
              isButtonDone={this.state.isButtonDone}
              changeTimeGranule={this.changeTimeGranule}
              changeTips={this.changeTips}
              changeStartTime={this.changeStartTime}
              changeEndTime={this.changeEndTime}
            ></HistoryDateChoose>
          </Sidebar>
          <Sidebar.Pusher>
            <HistoricalComponent
              title={title}
              grid={grid}
              toolbox={toolbox}
              tooltip={tooltip}
              legend={legend}
              dataZoom={dataZoom}
              xAxis={xAxis}
              yAxis={yAxis}
              series={series}
              seriesDataUpdate={seriesDataUpdate}
              dates={dates}
              restOptions={restOptions}
              onDatazoom={this.onDatazoom}
              debounceDatazoomDuration={500}
              containerStyle={{ height: "44vh", width: "100%" }}
            />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

const mapStateToProps = ({ verified }) => {
  return {
    verified,
  };
};

export default connect(mapStateToProps)(HookDataHistory);
