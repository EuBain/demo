

var http = require("http");

http.createServer(function(req,res) {
  data = '这是app111111111111111111111'
  console.log(data)
  time = (new Date).getTime().toString() + '\n';
  res.writeHead(200,{"Content-Type":"text/plain"});
  res.end(data)
}).listen(3001);

const  b = http.createServer(function(req,res) {
  // const options = 'http://192.168.0.3:3002/';     // ipaddrss 
  const options = 'http://app2:3002/';     // app name 
  // const options = 'http://docker-web2-1:3002/';     // container name 
  // const options = 'http://1f10852ad697:3002/';  // id  
  // const options = 'http://bridge2:3002/';  // network name false

  



  const externalRequest = http.request(options, (externalRes) => {
    let data = '在app1中请求app2获取的数据';
    // 接收来自外部URL的数据
    externalRes.on('data', (chunk) => {
      data += chunk;
    });
    // 响应完成时，向客户端发送数据
    externalRes.on('end', () => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
    });
  });

  externalRequest.on('error', (error) => {
    console.error(error);
  });

  externalRequest.end();
}).listen(3003)

