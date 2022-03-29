function list(method) {
  let res = null;
  switch (method) {
    case "GET":
      res = [
        {
          id: "00001",
          name: "张金金",
          status: 1,
          start_time: "2021-10-01 8:00:00",
          end_time: "",
          desc: "",
        },
        {
          id: "000012",
          name: "李四",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00003",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00004",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00005",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00006",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00007",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00008",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00009",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00010",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "00011",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
        {
          id: "000012",
          name: "张金金",
          status: 1,
          start_time: "2021-10-01 8:00:00",
          end_time: "",
          desc: "",
        },
        {
          id: "00013",
          name: "张金金",
          status: 1,
          start_time: "2021-10-01 8:00:00",
          end_time: "",
          desc: "",
        },
        {
          id: "00014",
          name: "张金金",
          status: 2,
          start_time: "2021-10-01 8:00:00",
          end_time: "2021-10-01 17:00:00",
          desc: "更换机油",
        },
      ];
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = list;