import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import NotFound from "../views/404";
import Forbidden from "../views/403";
import findLast from "lodash/findLast";
import { isLogin, login, check } from "../utils/auth";
// import * as dd from "dingtalk-jsapi";
// import api from "@/api";
// import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/BasicLayout.vue"),
    children: [
      {
        path: "/",
        redirect: "/dashboard/summary",
      },
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          icon: "dashboard",
          title: "仪表盘",
          authority: ["admin", "superAdmin"],
        },
        redirect: "/dashboard/summary",
        component: { render: (h) => h("router-view") },
        children: [
          {
            path: "/dashboard",
            redirect: "/dashboard/summary",
          },
          {
            path: "/dashboard/summary",
            meta: { title: "概览" },
            name: "dashboard-summary",
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Dashboard/Summary.vue"
              ),
          },
        ],
      },
      {
        path: "/machineTool",
        meta: {
          icon: "funnel-plot",
          title: "机床",
          authority: ["admin", "superAdmin"],
        },
        name: "machineTool",
        redirect: "/machineTool/list",
        component: { render: (h) => h("router-view") },
        children: [
          {
            path: "/machineTool",
            redirect: "/machineTool/list",
          },
          {
            path: "/machineTool/list",
            meta: { title: "列表" },

            name: "machineTool-list",

            component: () =>
              import(
                /* webpackChunkName: "machine" */ "../views/MachineTool/List.vue"
              ),
          },
          {
            path: "/machineTool/shutdownList",
            meta: { title: "停用列表" },

            name: "machineTool-shutdownList",
            component: () =>
              import(
                /* webpackChunkName: "machine" */ "../views/MachineTool/ShutdownList.vue"
              ),
          },
          {
            path: "/machineTool/detail/:id/:num",
            meta: {
              title: "机床详情",
              breadCrumb: [
                { title: "首页", path: "/" },
                { title: "列表", path: "/machineTool/list" },
                { title: "详情", path: "/machineTool/detail" },
              ],
              selectedKeys: ["/machineTool/list"],
              openKeys: ["/", "/machineTool"],
            },
            hideInMenu: true,
            name: "machineTool-detail",
            component: () =>
              import(
                /* webpackChunkName: "machine" */ "../views/MachineTool/Detail.vue"
              ),
          },
        ],
      },
      {
        path: "/mould",
        meta: {
          icon: "hourglass",
          title: "模具",
          authority: ["admin", "superAdmin"],
        },
        redirect: "/mould/list",
        name: "mould",
        component: { render: (h) => h("router-view") },
        children: [
          {
            path: "/mould",
            redirect: "/mould/list",
          },
          {
            path: "/mould/list",
            meta: { title: "冲压模具列表" },

            name: "mould-list",
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Mould/List.vue"
              ),
          },
          {
            path: "/mould/shutdownList",
            meta: { title: "停用列表" },

            name: "mould-shutdownList",
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Mould/ShutdownList.vue"
              ),
          },
          {
            path: "/mould/idleList",
            meta: { title: "闲置列表" },
            name: "mould-idleList",
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Mould/IdleList.vue"
              ),
          },
          {
            path: "/mould/detail/:id/:num",
            meta: {
              title: "模具详情",
              breadCrumb: [
                { title: "首页", path: "/" },
                { title: "列表", path: "/mould/list" },
                { title: "详情", path: "/mould/detail" },
              ],
              selectedKeys: ["/mould/list"],
              openKeys: ["/", "/mould"],
            },
            hideInMenu: true,
            name: "machineTool-detail",
            component: () =>
              import(
                /* webpackChunkName: "machine" */ "../views/Mould/Detail.vue"
              ),
          },
        ],
      },
      {
        path: "/message",
        name: "message",
        meta: { icon: "message", title: "报文中心", authority: ["superAdmin"] },
        redirect: "/message/list",
        component: { render: (h) => h("router-view") },
        children: [
          {
            path: "/message",
            redirect: "/message/list",
          },
          {
            path: "/message/list",
            name: "message-list",
            meta: { title: "报文列表" },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Message/List.vue"
              ),
          },
        ],
      },
      {
        path: "/config",
        name: "config",
        meta: { icon: "setting", title: "配置中心", authority: ["superAdmin"] },
        redirect: "/config/list",
        component: { render: (h) => h("router-view") },
        children: [
          {
            path: "/config",
            redirect: "/config/list",
          },
          {
            path: "/config/list",
            name: "config-list",
            meta: { title: "管理员列表" },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Config/AdminList.vue"
              ),
          },
          {
            path: "/config/maitain/item/list",
            name: "maitain-item-list",
            meta: { title: "模具保养项目列表" },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Config/MouldMaintainItemList.vue"
              ),
          },
          {
            path: "/config/supply/list",
            name: "supply-list",
            meta: { title: "供应商列表" },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Config/SupplyList.vue"
              ),
          },
          {
            path: "/config/epc/:supplyId/:supplyName",
            meta: {
              title: "EPC列表",
              breadCrumb: [
                { title: "首页", path: "/" },
                { title: "供应商列表", path: "/config/supply/list" },
                { title: "EPC列表", path: "/config/epc" },
              ],
              selectedKeys: ["/config/supply/list"],
              openKeys: ["/", "/config"],
            },
            hideInMenu: true,
            name: "machineTool-detail",
            component: () =>
              import(
                /* webpackChunkName: "machine" */ "../views/Config/EPCList.vue"
              ),
          },
        ],
      },
    ],
  },
  {
    path: "/user",
    hideInMenu: true,
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/UserLayout.vue"),
    children: [
      {
        path: "/user",
        redirect: "/user/login",
      },
      {
        path: "/user/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/User/Login.vue"),
      },
      {
        path: "/user/register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/User/Register.vue"),
      },
    ],
  },
  {
    path: "/403",
    hideInMenu: true,
    component: Forbidden,
  },
  {
    path: "*",
    hideInMenu: true,
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // 判断是否登录，已登录继续，未登录则调用免登接口
  if (!isLogin()) {
    login().then(() => {
      const record = findLast(to.matched, (record) => record.meta.authority);
      if (record && !check(record.meta.authority) && to.path !== "/403") {
        next({
          path: "/403",
        });
        NProgress.done();
      }
    });
  }
  // 已登录后判断权限，有权限继续，没有权限跳转到403界面
  if (to.path !== from.path) {
    NProgress.start();
  }

  // 若breadCrumb, 分情况赋值openKeys 和 selectedKeys
  if (to.meta.breadCrumb && to.meta.breadCrumb.length > 1) {
    to.meta.selectedKeys = [from.fullPath];
    to.meta.breadCrumb[1].path = from.fullPath;
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
