var dispatch = require('httpdispatcher'),
    http = require('http'),
    fs = require('fs')
    mozlog = require('mozlog');

mozlog.config({app: "dockerflow-demo"});
var log = mozlog("general");

dispatch.onGet("/", (req, res) => {
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("hello.")
});

// Service check endpoint
dispatch.onGet("/__heartbeat__", (req, res) => {
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("OK")
});

// Load balancer check endpoint
dispatch.onGet("/__lbheartbeat__", (req, res) => {
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("OK")
});

// this demo uses an environment variable to 
// find the location of the version file. 
dispatch.onGet("/__version__", (req, res) => {
  fs.stat(process.env.VERSION_FILE, (err, stats) => {
    if (err) {
      res.writeHead(404, {"Content-Type":"text/plain"})
      res.end("VERSION_FILE not found");
    } else {
      res.writeHead(200, {"Content-Type":"text/json"});
      var fstream = fs.createReadStream(process.env.VERSION_FILE);
      fstream.pipe(res)
    }
  });
});

// listen on the PORT env. variable
http.createServer((res, req) => {
  dispatch.dispatch(res, req);
}).listen(process.env.PORT, ()=> { 
  log.info("listening", {port: process.env.PORT})
}); 
