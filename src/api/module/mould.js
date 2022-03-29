import request from "@/utils/request";

const GET_MOULD_LIST = function (data) {
  return request({
    url: "/machine/select",
    params: data,
  });
};

const UPDATE_STATUS = function (data) {
  return request({
    url: "/machine/updateStatus",
    data,
    method: "post",
  });
};

const SET_MOULD = function (data) {
  // 大保养上限要乘以1000传给后端
  data.big_limit = data.big_limit * 1000;
  return request({
    url: "/machine/add",
    data,
    method: "post",
  });
};

const EDIT_MOULD = function (data) {
  data.big_limit = data.big_limit * 1000;
  return request({
    url: "/machine/modify",
    data,
    method: "post",
  });
};

export default {
  GET_MOULD_LIST,
  SET_MOULD,
  EDIT_MOULD,
  UPDATE_STATUS,
};
