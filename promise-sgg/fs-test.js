const util = require("util");
const fs = require("fs");

// 返回一个新的函数，这个函数返回的结果是一个promise，可以直接使用then
let mineReadFile = util.promisify(fs.readFile);
mineReadFile("./promise-sgg/content.txt").then((value) => {
  console.log(value.toString());
});
