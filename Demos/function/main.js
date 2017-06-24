function say(word){
	console.log(word);
}
function execute(someFuction, Value){
	someFuction(Value);
}
execute(say, "Hello");

//函数传递是如何让HTTP服务器工作的
var http = require("http");
function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}
http.createServer(onRequest).listen(8888);