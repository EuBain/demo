

var http = require("http");

http.createServer(function(req,res) {
  data = '这是app2'
  console.log(data)
  time = (new Date).getTime().toString() + '\n';
  res.writeHead(200,{"Content-Type":"text/plain"});
  res.end(data)
}).listen(3002);


console.log("Starting server running at http://127.0.0.1:3000/")