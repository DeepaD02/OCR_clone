const fs = require("fs");

if (!fs.existsSync("./docs")) {
  fs.mkdir("./docs", (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Folder created");
    }
  });
}

if (!fs.existsSync("./docs/text1.txt")) {
  fs.writeFile("./docs/text1.txt", "Hello world", (err) => {
    if (err) {
      console.log(err.message);
    }    else {
      console.log("File Created");
    }
  });
}

fs.readFile("./docs/text1.txt", (err, data) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(data.toString());
  }
});

if (fs.existsSync("./docs/text1.txt")) {
  fs.unlink("./docs/text1.txt", (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Deleted");
    }
  });
}
