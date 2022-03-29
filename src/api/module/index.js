import request from "@/utils/request";

const GET_MACHINE_TOTAL = function (data) {
  return request({
    url: "/machine/countJC",
    params: data,
  });
};

const GET_MOULD_TOTAL = function (data) {
  return request({
    url: "/machine/countMJ",
    params: data,
  });
};

export default { GET_MACHINE_TOTAL, GET_MOULD_TOTAL };
