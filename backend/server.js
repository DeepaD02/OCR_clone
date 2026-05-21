const http = require("http");

const servers = http.createServer((req, res) => {
  console.log("Request Happen");
  console.log(req.url);



  res.end("<h1>hello</h1>");
});

servers.listen("5174", "localhost", () => {
  console.log("Server listening");
});