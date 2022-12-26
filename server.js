// import express
const express = require("express");

// import app object
const app = express();

// create routing rule
app.get("/server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  // set response body
  response.send("Hello Ajax");
});

app.all("/json-server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");

  const data = {
    name: "atguigu8848",
  };

  let str = JSON.stringify(data);
  // set response body
  response.send(str);
});

// listen port
app.listen(8000, () => {
  console.log("Service has been initialized, 8000 is listening.");
});
