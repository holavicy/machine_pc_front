function response(method) {
  let res = null;
  switch (method) {
    case "GET":
      res = {
        userId: "100369"
      }
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = response;