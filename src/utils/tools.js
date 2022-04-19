export function dateChangeFormat(format, date) {
  date = new Date(date);
  const dataItem = {
    "Y+": date.getFullYear().toString(),
    "m+": (date.getMonth() + 1).toString(),
    "d+": date.getDate().toString(),
    "H+": date.getHours().toString(),
    "M+": date.getMinutes().toString(),
    "S+": date.getSeconds().toString(),
  };
  Object.keys(dataItem).forEach((item) => {
    const ret = new RegExp(`(${item})`).exec(format);
    if (ret) {
      format = format.replace(
        ret[1],
        ret[1].length === 1
          ? dataItem[item]
          : dataItem[item].padStart(ret[1].length, "0")
      );
    }
  });
  return format;
}
// 根据分钟数计算小时、分钟、秒
export function computeTimes(data) {
  const seconds = data * 60; // 传入的是含有小数点的分钟数，先转化成秒
  const second = Math.round(seconds % 60); // 取余，获取秒数
  const minutes = parseInt(seconds / 60); // 取整，获取总的分钟数
  const minute = minutes % 60; // 取余，获取分钟数
  const hour = parseInt(minutes / 60); // 取整，获取小时数
  return data > 0
    ? (hour > 0 ? hour + "小时" : "") +
        (minute > 0 ? minute + "分钟" : "") +
        (second > 0 ? second + "秒" : "")
    : "0";
}
export const domain = "http://192.168.40.229:8081";
export const statusDict = {
  0: "正常使用",
  4: "待小保养",
  5: "待大保养",
  1: "小保养中",
  2: "大保养中",
};
export const statusAllDict = {
  0: "正常使用",
  1: "小保养中",
  2: "大保养中",
  3: "已停用",
  4: "待小保养",
  5: "待大保养",
  6: "闲置",
  7: "删除",
};
export const cateIdDict = {
  1: "模具",
  2: "机床",
};
export const alertFlag = {
  0: "是",
  1: "否",
};
export const alertStatus = {
  1: "发送成功",
  2: "发送失败",
  3: "未发送",
};
