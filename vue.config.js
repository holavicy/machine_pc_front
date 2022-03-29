const path = require("path");
// 基础路径 注意发布之前要先修改这里
const publicPath = "/machine";
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath,
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    publicPath,
    proxy: {
      "/apiMachine": {
        // target: "http://localhost:3000",
        target: "http://192.168.40.163:8085",
        pathRewrite: {
          "^/apiMachine": "",
        },
        bypass: function (req, res) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.");
            return "/index.html";
          } else if (process.env.MOCK !== "none") {
            console.log(req.path);
            const name = req.path.split("/apiMachine/")[1].split("/").join("_");
            const mock = require(`./mock/${name}`);
            const result = mock(req.method);
            delete require.cache[require.resolve(`./mock/${name}`)];
            return res.send(result);
          }
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
  },
};
