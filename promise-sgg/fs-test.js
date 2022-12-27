const util = require("util");
const fs = require("fs");
const mineReadFile = util.promisify(fs.readFile);

async function main() {
  try {
    let data1 = await mineReadFile("./promise-sgg/content1.txt");
    let data2 = await mineReadFile("./promise-sgg/content2.txt");
    let data3 = await mineReadFile("./promise-sgg/content3.txt");
    console.log(data1 + data2 + data3);
  } catch (e) {
    console.warn(e);
  }
}
main();
