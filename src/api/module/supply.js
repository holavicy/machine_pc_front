import request from "@/utils/request";

const GET_SUPPLY_LIST = function (data) {
  return request({
    url: "/supplier/load",
    params: data,
  });
};
const ADD_SUPPLY = function (data) {
  return request({
    url: "/supplier/add",
    data,
    method: "post",
  });
};
const UPDATE_SUPPLY = function (data) {
  return request({
    url: "/supplier/modify",
    data,
    method: "post",
  });
};
const DEL_SUPPLY = function (data) {
  return request({
    url: "/supplier/delete",
    data,
    method: "post",
  });
};

export default {
  GET_SUPPLY_LIST,
  ADD_SUPPLY,
  UPDATE_SUPPLY,
  DEL_SUPPLY,
};
