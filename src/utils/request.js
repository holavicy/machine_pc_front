import axios from "axios";
import { notification } from "ant-design-vue";

function formatObj(obj) {
  Object.keys(obj).forEach((item) => {
    if (obj[item] !== 0 && !obj[item]) delete obj[item];
  });
  return obj;
}

function request(options) {
  // 去掉值为空的参数
  if (options.data) {
    options.data = formatObj(options.data);
  }
  if (options.params) {
    options.params = formatObj(options.params);
  }

  if (options.method && options.method === "post") {
    options.transformRequest = [
      function (data) {
        let ret = "";
        for (let it in options.data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.lastIndexOf("&"));
        return ret;
      },
    ];
  }
  options.baseURL = "/apiMachine";
  return axios(options)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      const {
        response: { status, statusText },
      } = error;
      notification.error({
        message: status,
        description: statusText,
      });
      return Promise.reject(error);
    });
}

export default request;
