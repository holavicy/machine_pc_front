import store from "@/store";
import * as dd from "dingtalk-jsapi";
import api from "@/api";

const corpId = "dingcd0f5a2514db343b35c2f4657eb6378f";

// 获取userid
function get_user_id() {
  return new Promise((reslov, reject) => {
    dd.ready(function () {
      dd.runtime.permission.requestAuthCode({
        corpId: corpId, // 企业id
        onSuccess: function (info) {
          api.GET_USER_ID(info.code).then((res) => {
            if (res.data && res.data.userId) {
              store.commit("user/setUserId", res.data.userId);
              reslov(res.data.userId);
            } else {
              reject({
                msg: info.code + "获取到的userid为空",
              });
            }
          });
        },
      });
    });
  });
}

// 获取用户信息
function get_user_info(user_id) {
  return new Promise((reslov, reject) => {
    api.GET_USER_INFO(user_id).then((res) => {
      store.commit("user/setJobNumber", res["data"]["jobNumber"]);
      store.commit("user/setName", res["data"]["name"]);
      getRoles(res["data"]["roleList"], res["data"]["jobNumber"]).then(
        (res) => {
          const roles = res;
          store.commit("user/setRoles", roles);
          reslov();
          reject();
        }
      );
    });
  });
}

// 过滤当前登录人的权限
function getRoles(roleList, staffNo) {
  return new Promise((reslov, reject) => {
    const roles = [];
    if (roleList.length > 0) {
      roleList.forEach((role) => {
        if (role.name == "设备管理员" && role.groupName == "应用权限") {
          roles.push("superAdmin");
          const isSuperAdmin = true;
          store.commit("user/setIsSuperAdmin", isSuperAdmin);
        }
      });
    }
    if (staffNo) {
      const data = {
        staff_no: staffNo,
        pageNum: 1,
        pageSize: 99999999,
      };
      api.GET_ADMIN_LIST(data).then((res) => {
        if (res.data.totalSize > 0) {
          roles.push("admin");
        }
        reslov(roles);
        reject();
      });
    } else {
      reslov(roles);
      reject();
    }
  });
}

// 获取权限
function getCurrentAuthority() {
  const roles = store.state.user.roles;
  return roles;
}

// 判断是否有权限
export function check(auth) {
  const current = getCurrentAuthority();
  return current.some((item) => auth.includes(item));
}

// 获取state里的jobnumber,若有值，则证明已登录，没有值则未登录
export function isLogin() {
  const job_number = store.state.user.job_number;
  return !!job_number;
}

// 登录
export function login() {
  return new Promise((resolve, reject) => {
    get_user_id().then((res) => {
      get_user_info(res)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}
