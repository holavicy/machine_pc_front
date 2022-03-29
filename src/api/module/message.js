import request from "@/utils/request";

const GET_MESSAGE_RECORDS = function (data) {
  return request({
    url: "/message/load",
    params: data,
  });
};

export default {
  GET_MESSAGE_RECORDS,
};
