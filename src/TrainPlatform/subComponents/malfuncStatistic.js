import React from "react";
import "../../FontEffects/chinese_char_design.css";
import "./animation.css";
import TablePageNav from "./table_page_nav/pageNav";

class MalfuncStatistic extends React.Component {
  processData = () => {
    const fakeData = [];
    for (let i = 0; i < 32; i++) {
      fakeData.push({
        mfCode: { text: i, type: "text", align: "center" }, // 每个单元格对应数据， text表示显示的文本, align: right, left, center(文字位置)
        dateTime: {
          text: new Date().toLocaleDateString(),
          type: "text",
          align: "center",
        },
        level: { text: i, type: "text", align: "center" },
        mfName: { text: "二车一类故障", type: "text", align: "center" },
      });
    }

    return fakeData;
  };

  buttonCallback = (element) => {
    // 点击后，会返回当前行所有数据
    console.log(element);
  };

  inputCallback = (input) => {
    // 点击后，会返回当前输入值
    console.log(input);
  };

  onNextPage = (pageNo) => {
    console.log(pageNo);
  };

  onPreviousPage = (pageNo) => {
    console.log(pageNo);
  };

  rowClickCallback = (element) => {
    // 点击后，会返回当前行所有数据
    console.log(element);
  };

  onDataSortCallback = (args) => {
    console.log("sorted", args[0], args[1]); // 排序方式，当前排序数据键值
  };

  onFliterInvokeCallback = (key) => {
    console.log("filted", key); // 当前排序数据键值
  };

  render() {
    return (
      <div>
        <TablePageNav
          dataList={this.processData()} // 数据：[{},{},{}...]
          rowsPerPage={9} // 每页的行数(会根据高度自动调整)
          height={this.props.height * 1.1} // 组件高度
          titleStyle={{
            headerSize: "tiny",
            headerStyle: {
              marginTop: "15px",
              height: "20px",
              fontSize: "100%",
              fontFamily: "chinese_char_design",
            },
          }}
          bodyPadding={{ left: "0%", right: "0%" }}
          titles={[
            {
              text: "故障代码",
              align: "center",
              key: "mfCode",
              type: "text",
              controlBtnAttr: {
                color: "teal",
                inverted: true,
                style: {},
              },
              sort: false,
              filter: false,
              sortCb: this.onDataSortCallback,
              filterCb: this.onFliterInvokeCallback,
            },
            {
              text: "时间",
              align: "center",
              key: "dateTime",
              type: "text",
              sort: false,
              filter: false,
            },
            {
              text: "等级",
              align: "center",
              key: "level",
              type: "text",
              filter: false,
              sort: false,
            },
            { text: "故障名称", align: "center", key: "mfName", type: "text" },
          ]}
          popupStyle={{
            style: { borderRadius: "0.2em", opacity: 0.9, padding: "0.5em" }, // 气泡整体css
            headerStyle: {}, // 标题css
            inputStyle: {}, // 输入框css
            inverted: true,
            headerSize: "large", // tiny small medium large huge
          }}
          animationDuration={0.5} // 过渡动画持续时间
          controlAttr={{
            containerCss: {
              position: "absolute",
              border: "0px",
              backgroundColor: "#5AA0E3",
              top: window.innerHeight * 0.33,
              left: 0,
              right: 0,
              opacity: 0.8,
              height: window.innerHeight * 0.04,
            }, // 控制组件容器css
            styleBtn: {}, // 控制按钮css属性
            styleInput: {
              height: window.innerHeight * 0.02,
              fontFamily: "chinese_char_design",
            }, // 控制输入栏css属性
            buttonAttr: {
              basic: false, // 是否仅保留边框
              inverted: true, // 是否反白
              color: "teal", // red orange yellow olive green teal blue violet purple pink brown grey black
              size: "mini", //mini tiny small medium large big huge massive
              compact: true, // 是否最节省空间
            },
            // 控制按钮快捷属性
            inputCb: this.inputCallback, // 输入回调
            backCb: this.onPreviousPage, // 前进回调
            nextCb: this.onNextPage, // 后退回调
          }}
          // 控制翻页组件属性
          rowClickCb={this.rowClickCallback} // 点击行回调
          tableStyle={{
            headerStyle: { backgroundColor: "#150734" },
            bodyStyle: {
              fontFamily: "chinese_char_design",
            },
            opacity: 1 /*  backgroundColor:"gray" */,
          }} // 表格样式： headerStyle表头样式， bodyStyle表格body样式，剩余属性为自身css样式
          tableColor={"blue"} // 表格固定颜色：red orange yellow olive green teal blue violet purple pink brown grey black
          striped // 是否采用斑马型表格
        />
      </div>
    );
  }
}

export default MalfuncStatistic;
