import request from "@/utils/request";

const GET_ADMIN_LIST = function (data) {
  return request({
    url: "/admin/select",
    params: data,
  });
};

const GET_ADMIN_MACHINE_LIST = function (data) {
  return request({
    url: "/machine/adminMachine",
    params: data,
  });
};

const GET_ADMIN_NO_MACHINE_LIST = function (data) {
  return request({
    url: "/machine/noAssignMachine",
    params: data,
  });
};

const ADD_ADMIN = function (data) {
  return request({
    url: "/admin/add",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const DEL_ADMIN = function (data) {
  return request({
    url: "/admin/delete",
    data,
    method: "post",
  });
};

const ADD_ADMIN_RELATION = function (data) {
  return request({
    url: "/machineStart/assignMachine",
    data,
    method: "post",
  });
};

const DEL_ADMIN_RELATION = function (data) {
  return request({
    url: "/machineStart/deleteAssign",
    data,
    method: "post",
  });
};

export default {
  GET_ADMIN_LIST,
  ADD_ADMIN,
  DEL_ADMIN,
  GET_ADMIN_MACHINE_LIST,
  GET_ADMIN_NO_MACHINE_LIST,
  ADD_ADMIN_RELATION,
  DEL_ADMIN_RELATION,
};
