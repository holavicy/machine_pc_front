function list(method) {
  let res = null;
  switch (method) {
    case "GET":
      res = [
        {
          id: 2,
          name: "gm",
          staff_no: 199133,
          staff_user_id_dd: "199133",
          status: "0",
          create_by: "管理员01",
          create_time: "2021-11-30T16:00:00.000+00:00"
      }
      ];
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = list;