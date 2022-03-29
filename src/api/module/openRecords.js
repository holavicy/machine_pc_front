import request from "@/utils/request";

const GET_OPEN_RECORDS = function (data) {
  return request({
    url: "/machineStart/findById",
    params: data,
  });
};

const ADD_OPEN_RECORD = function (data) {
  return request({
    url: "/machineStart/newStart",
    data,
    method: "post",
  });
};

const UPDATE_OPEN_RECORD = function (data) {
  return request({
    url: "/machineStart/modifyStart",
    data,
    method: "post",
  });
};

const DEL_OPEN_RECORD = function (data) {
  return request({
    url: "/machineStart/deleteStart",
    data,
    method: "post",
  });
};

export default {
  GET_OPEN_RECORDS,
  ADD_OPEN_RECORD,
  UPDATE_OPEN_RECORD,
  DEL_OPEN_RECORD,
};
