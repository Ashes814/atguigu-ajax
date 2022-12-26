const fs = require("fs");

let p = new Promise((resolve, rejcet) => {
  fs.readFile("./promise-sgg/content.txt", (err, data) => {
    if (err) rejcet(err);

    resolve(data);
  });
});

p.then(
  (value) => {
    console.log(value.toString());
  },
  (reason) => {
    throw reason;
  }
);
