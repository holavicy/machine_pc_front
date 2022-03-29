function list(method) {
  let res = null;
  switch (method) {
    case "GET":
      res = [
        {
          id: 1,
          name: `{"DeviceNum":"DefaultDevice","MachineToolNum":"DefaultMachineToolNum","SystemTime":1636117609}\r\n`,
          staff_no: '2021-10-01 8:00:00',
          staff_user_id_dd: "是",
          status: "成功",
          create_by: "肖超",
          create_time: "您管理的设备已达到小保养上限，请及时保养"
      },
      {
        id: 2,
        name: `{"DeviceNum":"DefaultDevice","MachineToolNum":"DefaultMachineToolNum","SystemTime":1636117609}\r\n`,
        staff_no: '2021-10-01 8:00:00',
        staff_user_id_dd: "否",
        status: "",
        create_by: "",
        create_time: ""
    }
      ];
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = list;