function response(method) {
  let res = null;
  switch (method) {
    case "GET":
      res = {
        active: true,
        admin: true,
        avatar: "https://static-legacy.dingtalk.com/media/lADPD4BhqvY3e8_NAr7NArw_700_702.jpg",
        boss: false,
        dept_id_list: [199785870],
        dept_order_list: [{ 'dept_id': 199785870, 'order': 176330871355643512 }],
        email: 'cmj@wetown.cc',
        exclusive_account: false,
        extension: '{"职务":"一级科员","position":"开发工程师"}',
        hide_mobile: false,
        hired_date: 1586707200000,
        job_number: '100297',
        leader_in_dept: [{ 'dept_id': 199785870, 'leader': false }],
        mobile: '18888178681',
        name: '陈明姣',
        org_email: 'cmj@wetown.cc',
        real_authed: true,
        remark: '',
        role_list: [{ 'group_name': 'PostSeries', 'id': 879690197, 'name': '行政岗位' }, { 'group_name': '应用权限', 'id': 1505687807, 'name': '积分管理员' }, { 'group_name': '应用权限', 'id': 2392943112, 'name': '设备管理员' }, { 'group_name': '应用权限', 'id': 1746959970, 'name': '餐厅管理' }, { 'group_name': '应用权限', 'id': 1505828740, 'name': '积分报表' }, { 'group_name': '应用权限', 'id': 1741844343, 'name': '福利管理员' }, { 'group_name': 'JobName', 'id': 578230634, 'name': '一级科员' }, { 'group_name': '性别', 'id': 1916564237, 'name': '女' }, { 'group_name': 'Position', 'id': 560617576, 'name': '开发工程师' }, { 'group_name': '职级', 'id': 489974116, 'name': '十二级' }, { 'group_name': '默认', 'id': 57274952, 'name': '子管理员' }, { 'group_name': '职位', 'id': 582574200, 'name': '员工' }],
        senior: false,
        state_code: '86',
        telephone: '',
        title: '行政岗位',
        union_emp_ext: {},
        unionid: '1hWb2Tvm1X98iiNDV03thOgiEiE',
        userid: "100297",
        work_place: ""
      }

      break;
    default:
      res = null;
  }
  return res;
}

module.exports = response;