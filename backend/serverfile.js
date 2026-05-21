const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  console.log("request happend");
  console.log(req.url);

  let path = "./htmlfiles/";
  let statusCode = 200;

  if (req.url === "/home" || req.url === "/") {
    path += "index.html";
  } else if (req.url === "/hello") {
    res.statusCode = 301;
    res.setHeader("location", "/home");
    res.end();
  } else if (req.url === "/about") {
    path += "about.html";
  } else if (req.url === "/contact") {
    path += "contact.html";
    statuscode = 200;
  } else {
    path += "error.html";
    statusCode = 404;
  }

  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.statusCode = statusCode;
      res.end(data);
    }
  });
});

server.listen("3000", "localhost", () => {
  console.log("Server listening...");
});
