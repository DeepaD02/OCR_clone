const fs = require("fs");
const { buffer } = require("stream/consumers");
const readstream = fs.createReadStream("./stream/text2.txt", {
  encoding: "utf8",
});
const writestream = fs.createWriteStream("./stream/Copytext2.txt");

readstream.on("data", (buffer) => {
  console.log("New Buffer");
  console.log(buffer);
});

readstream.on("data", (buffer) => {
  writestream.write(buffer);
});
