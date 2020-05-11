const fs = require('fs');
const express = require('express')

const mozlog = require('mozlog')({
  app: "dockerflow-demo"
});
const log = mozlog("general");

const verfile = __dirname + "/version.json";

const app = express();

app.get('/', (req, res) => res.send('Hello from dockerflow example app!'));

// for service monitoring to make sure the
// service is responding and normal
app.get("/__heartbeat__", (req, res) => {
  fs.stat(verfile, (err) => {
    if (err) {
      res.status(500).send({ "status": "error", "checks": {"version_file_exists": "error"}, "details": {} });
    } else {
      res.send({ "status": "ok", "checks": {"version_file_exists": "ok"}, "details": {} });
    }
  });
});

// for load balancers to make sure the app is
// running
app.get("/__lbheartbeat__", (req, res) => res.send("OK"));

app.get("/__version__", (req, res) => {
  fs.stat(verfile, (err, stats) => {
    if (err) {
      res.status(404).send("version data not found");
    } else {
      res.sendFile(verfile);
    }
  });
});

// listen on the PORT env. variable
if (process.env.PORT) {
  app.listen(process.env.PORT, () => log.info("server", {msg: "listening", port: process.env.PORT}));
} else {
  log.error("server", {msg: "no PORT env var"});
}
