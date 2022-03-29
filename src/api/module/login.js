import request from "@/utils/request";

const GET_USER_ID = function (code) {
  return request({
    url: "/login?code=" + code,
  });
};

const GET_USER_INFO = function (user_id) {
  return request({
    url: "/dduser?userid=" + user_id,
  });
};

const JASPI_CONFIG = function (data) {
  return request({
    url: "/ddjq?url=" + data.url,
  });
};

export default { GET_USER_ID, GET_USER_INFO, JASPI_CONFIG };
