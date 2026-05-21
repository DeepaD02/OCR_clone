const exp = require("express");

const app = exp();

// app.get("/", (req, res) => {
//   res.send("Hello! Welcome to Express Js ");
// });

app.listen(3000);

app.use((req, res, next) => {
  console.log("middleware done");
  console.log(req.host);
  console.log(req.path);
  console.log(req.method);
  next();
});

app.get("/", (req, res) => {
  res.status(200).sendFile("./htmlfiles/index.html", { root: __dirname });
});

app.get("/home", (req, res) => {
  res.sendFile("./htmlfiles/index.html", { root: __dirname });
});
app.get("/about", (req, res) => {
  res.sendFile("./htmlfiles/about.html", { root: __dirname });
});

app.get("/contact", (req, res) => {
  res.sendFile("./htmlfiles/contact.html", { root: __dirname });
});
app.get("/contactus", (req, res) => {
  res.status(301).redirect("/contact");
});

app.use((req, res) => {
  res.status(404).sendFile("./htmlfiles/error.html", { root: __dirname });
});
