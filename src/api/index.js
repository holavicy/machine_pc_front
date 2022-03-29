import login from "../api/module/login";
import admin from "../api/module/admin";
import mould from "../api/module/mould";
import index from "../api/module/index";
import maintain from "../api/module/maintain";
import openRecords from "../api/module/openRecords";
import message from "../api/module/message";
import supply from "../api/module/supply";
import epc from "../api/module/epc";

const api = {
  ...login,
  ...admin,
  ...mould,
  ...index,
  ...maintain,
  ...openRecords,
  ...message,
  ...supply,
  ...epc,
};

export default api;
