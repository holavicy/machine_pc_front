import request from "@/utils/request";

const GET_EPC_LIST = function (data) {
  return request({
    url: "/machine/loadBySupplier",
    params: data,
  });
};

const ADD_EPC = function (data) {
  return request({
    url: "/epc/add",
    data,
    method: "post",
  });
};

const UPDATE_EPC = function (data) {
  return request({
    url: "/epc/modify",
    data,
    method: "post",
  });
};

const DEL_EPC = function (data) {
  return request({
    url: "/epc/delete",
    data,
    method: "post",
  });
};

export default {
  GET_EPC_LIST,
  ADD_EPC,
  UPDATE_EPC,
  DEL_EPC,
};
