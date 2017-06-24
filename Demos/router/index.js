var server = require("./server");
var router = require("./router");

server.start(router.route);

//浏览器打开http://127.0.0.1:8888/