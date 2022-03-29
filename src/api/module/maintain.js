import request from "@/utils/request";

const GET_LATEST_START_RECOR = function (data) {
  return request({
    url: "/machineStart/loadFirst",
    params: data,
  });
};

const GET_ALL_MAINTAIN_RECORDS = function (data) {
  return request({
    url: "/machineStart/loadMaintain",
    params: data,
  });
};

const ADD_START_RECORD = function (data) {
  return request({
    url: "/machineStart/startMaintain",
    data,
    method: "post",
  });
};

const ADD_STOP_RECORD = function (data) {
  return request({
    url: "/machineStart/endMaintain",
    data,
    method: "post",
  });
};

// 获取所有的保养项目
const GET_MAINTAIN_ITEM = function (data) {
  return request({
    url: "/item/load",
    params: data,
  });
};

// 新增保养项目
const ADD_MAINTAIN_ITEM = function (data) {
  return request({
    url: "/machineStart/loadMaintain",
    data,
    method: "post",
  });
};

// 修改保养项目
const UPDATE_MAINTAIN_ITEM = function (data) {
  return request({
    url: "/machineStart/loadMaintain",
    data,
    method: "post",
  });
};

// 删除保养项目
const DEL_MAINTAIN_ITEM = function (data) {
  return request({
    url: "/machineStart/loadMaintain",
    data,
    method: "post",
  });
};

// 查询某个设备的保养项目
const GET_ITEM_BY_ID = function (data) {
  return request({
    url: "/item/findById",
    params: data,
  });
};

export default {
  GET_LATEST_START_RECOR,
  ADD_START_RECORD,
  ADD_STOP_RECORD,
  GET_ALL_MAINTAIN_RECORDS,
  GET_MAINTAIN_ITEM,
  ADD_MAINTAIN_ITEM,
  UPDATE_MAINTAIN_ITEM,
  DEL_MAINTAIN_ITEM,
  GET_ITEM_BY_ID,
};
