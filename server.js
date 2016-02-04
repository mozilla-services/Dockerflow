var dispatch = require('httpdispatcher'),
    http = require('http'),
    fs = require('fs')
    mozlog = require('mozlog');

mozlog.config({app: "dockerflow-demo"});
var log = mozlog("general");

var verfile = __dirname + "/version.json";

dispatch.onGet("/", (req, res) => {
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("hello.")
});

// for service monitoring to make sure the 
// service is responding and normal
dispatch.onGet("/__heartbeat__", (req, res) => {
  fs.stat(verfile, (err) => {
    if (err) {
      res.writeHead(500, {"Content-Type":"text/plain"});
      res.end("Could not find version file")
    } else {
      res.writeHead(200, {"Content-Type":"text/plain"});
      res.end("OK")
    }
  });
});

// for load balancers to make sure the app is 
// running
dispatch.onGet("/__lbheartbeat__", (req, res) => {
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("OK")
});

dispatch.onGet("/__version__", (req, res) => {
  fs.stat(verfile, (err, stats) => {
    if (err) {
      res.writeHead(404, {"Content-Type":"text/plain"})
      res.end("version data not found");
    } else {
      res.writeHead(200, {"Content-Type":"text/json"});
      var fstream = fs.createReadStream(verfile);
      fstream.pipe(res)
    }
  });
});

// listen on the PORT env. variable
if (process.env.PORT) {
  http.createServer((res, req) => { 
    dispatch.dispatch(res, req);
  }).listen(process.env.PORT, ()=> { 
    // output to stdout in mozlog format
    log.info("server", {msg: "listening", port: process.env.PORT})
  }); 
} else {
  log.error("server", {msg: "no PORT env var"});
}
